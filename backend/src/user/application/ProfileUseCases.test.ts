import { describe, expect, it, vi } from 'vitest'
import { ProfileUseCases } from './ProfileUseCases.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import type { IImageStorage } from '../../image/ports/IImageStorage.js'
import type { UpdateMyProfileInput, UserProfile } from '../domain/User.js'
import { MAX_AVATAR_BYTES, type UploadAvatarInput } from '../domain/Avatar.js'
import { InvalidAvatarError, UserNotFoundError } from '../domain/UserErrors.js'

const mockUser: UserProfile = {
  id: 'user-1',
  firstName: 'Bob',
  lastName: 'Martin',
  email: 'bob@example.com',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  loginAttempts: 0,
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  roles: [],
}

const makeRepo = (overrides: Partial<IUserRepository> = {}): IUserRepository => ({
  findById: vi.fn().mockResolvedValue(mockUser),
  findByEmailWithPassword: vi.fn(),
  findByIdWithPassword: vi.fn(),
  findAll: vi.fn(),
  count: vi.fn(),
  update: vi.fn().mockImplementation(async (_id: string, input: object) => ({ ...mockUser, ...input })),
  replaceAvatar: vi.fn().mockImplementation(async (_id: string, avatar: string | null) => ({
    user: { ...mockUser, avatar },
    previousAvatar: null,
  })),
  delete: vi.fn(),
  incrementLoginAttempts: vi.fn(),
  lockUntil: vi.fn(),
  resetLoginAttempts: vi.fn(),
  findAuthState: vi.fn(),
  changePassword: vi.fn(),
  revokeTokens: vi.fn(),
  ...overrides,
})

const makeStorage = (overrides: Partial<IImageStorage> = {}): IImageStorage => ({
  save: vi.fn().mockResolvedValue({ id: 'image-2', url: '/images/image-2' }),
  findById: vi.fn(),
  delete: vi.fn().mockResolvedValue(undefined),
  deleteByOwner: vi.fn().mockResolvedValue(undefined),
  deleteByOwnerAndUrl: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0]
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const WEBP_HEADER = [0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]

/** A repository whose user currently has `previousAvatar` as avatar. */
const makeRepoWithAvatar = (previousAvatar: string): IUserRepository =>
  makeRepo({
    replaceAvatar: vi.fn().mockImplementation(async (_id: string, avatar: string | null) => ({
      user: { ...mockUser, avatar },
      previousAvatar,
    })),
  })

/** `size` bytes starting with the given header. */
const bytes = (header: number[], size = header.length + 4): Buffer => {
  const buffer = Buffer.alloc(size)
  buffer.set(header)
  return buffer
}
const base64 = (header: number[], size?: number): string => bytes(header, size).toString('base64')

const reasonOf = async (promise: Promise<unknown>): Promise<string | undefined> => {
  const error = await promise.then(
    () => undefined,
    (err: unknown) => err
  )
  expect(error).toBeInstanceOf(InvalidAvatarError)
  return (error as InvalidAvatarError).reason
}

describe('ProfileUseCases.updateProfile', () => {
  it('updates the first and last name', async () => {
    const repo = makeRepo()
    const result = await new ProfileUseCases(repo, makeStorage()).updateProfile('user-1', {
      firstName: 'Robert',
      lastName: 'Durand',
    })
    expect(repo.update).toHaveBeenCalledWith('user-1', { firstName: 'Robert', lastName: 'Durand' })
    expect(result).toMatchObject({ firstName: 'Robert', lastName: 'Durand' })
  })

  it('clears the last name when it is null', async () => {
    const repo = makeRepo()
    await new ProfileUseCases(repo, makeStorage()).updateProfile('user-1', { lastName: null })
    expect(repo.update).toHaveBeenCalledWith('user-1', { lastName: null })
  })

  it('leaves an omitted field untouched', async () => {
    const repo = makeRepo()
    await new ProfileUseCases(repo, makeStorage()).updateProfile('user-1', { firstName: 'Robert' })
    expect(repo.update).toHaveBeenCalledWith('user-1', { firstName: 'Robert' })
  })

  it('never forwards anything but firstName and lastName', async () => {
    const repo = makeRepo()
    const hostile = {
      firstName: 'Robert',
      isAdmin: true,
      email: 'other@example.com',
      avatar: '/images/someone-else',
      isActive: false,
      password: 'x',
    } as UpdateMyProfileInput
    await new ProfileUseCases(repo, makeStorage()).updateProfile('user-1', hostile)
    expect(repo.update).toHaveBeenCalledWith('user-1', { firstName: 'Robert' })
  })

  it('throws UserNotFoundError when the user does not exist, without writing', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new ProfileUseCases(repo, makeStorage()).updateProfile('gone', { firstName: 'X' })).rejects.toThrow(
      UserNotFoundError
    )
    expect(repo.update).not.toHaveBeenCalled()
  })
})

describe('ProfileUseCases.updateAvatar', () => {
  it.each<[UploadAvatarInput['contentType'], number[]]>([
    ['image/jpeg', JPEG_HEADER],
    ['image/png', PNG_HEADER],
    ['image/webp', WEBP_HEADER],
  ])('stores a %s picture and points the profile at it', async (contentType, header) => {
    const repo = makeRepo()
    const storage = makeStorage()

    const result = await new ProfileUseCases(repo, storage).updateAvatar('user-1', {
      contentType,
      data: base64(header),
    })

    expect(storage.save).toHaveBeenCalledWith({ data: bytes(header), contentType, ownerId: 'user-1' })
    expect(repo.replaceAvatar).toHaveBeenCalledWith('user-1', '/images/image-2')
    expect(result.avatar).toBe('/images/image-2')
    // No previous picture: nothing to delete.
    expect(storage.deleteByOwnerAndUrl).not.toHaveBeenCalled()
  })

  it('deletes the picture it replaced, and only that one, once the profile points at the new one', async () => {
    const repo = makeRepoWithAvatar('/images/image-1')
    const storage = makeStorage()

    await new ProfileUseCases(repo, storage).updateAvatar('user-1', {
      contentType: 'image/jpeg',
      data: base64(JPEG_HEADER),
    })

    expect(storage.deleteByOwnerAndUrl).toHaveBeenCalledExactlyOnceWith('user-1', '/images/image-1')
    expect(storage.deleteByOwner).not.toHaveBeenCalled()
    expect(storage.delete).not.toHaveBeenCalled()
    const order = (fn: unknown) => vi.mocked(fn as () => void).mock.invocationCallOrder[0]
    expect(order(storage.save)).toBeLessThan(order(repo.replaceAvatar))
    expect(order(repo.replaceAvatar)).toBeLessThan(order(storage.deleteByOwnerAndUrl))
  })

  it('accepts a picture of exactly the size limit', async () => {
    const storage = makeStorage()
    await new ProfileUseCases(makeRepo(), storage).updateAvatar('user-1', {
      contentType: 'image/png',
      data: base64(PNG_HEADER, MAX_AVATAR_BYTES),
    })
    expect(storage.save).toHaveBeenCalledOnce()
  })

  describe('refuses, without storing anything', () => {
    const attempt = async (input: UploadAvatarInput) => {
      const repo = makeRepo()
      const storage = makeStorage()
      const reason = await reasonOf(new ProfileUseCases(repo, storage).updateAvatar('user-1', input))
      expect(storage.save).not.toHaveBeenCalled()
      expect(storage.deleteByOwnerAndUrl).not.toHaveBeenCalled()
      expect(repo.replaceAvatar).not.toHaveBeenCalled()
      return reason
    }

    it('a picture one byte above the size limit', async () => {
      const data = base64(JPEG_HEADER, MAX_AVATAR_BYTES + 1)
      expect(await attempt({ contentType: 'image/jpeg', data })).toBe('TOO_LARGE')
    })

    it('a picture far above the size limit', async () => {
      const data = base64(JPEG_HEADER, MAX_AVATAR_BYTES * 3)
      expect(await attempt({ contentType: 'image/jpeg', data })).toBe('TOO_LARGE')
    })

    it.each<[string, UploadAvatarInput['contentType'], number[]]>([
      ['PNG bytes declared as JPEG', 'image/jpeg', PNG_HEADER],
      ['JPEG bytes declared as PNG', 'image/png', JPEG_HEADER],
      ['JPEG bytes declared as WebP', 'image/webp', JPEG_HEADER],
      ['HTML declared as PNG', 'image/png', [...Buffer.from('<html><script>alert(1)</script>')]],
    ])('%s', async (_label, contentType, header) => {
      expect(await attempt({ contentType, data: base64(header) })).toBe('CONTENT_MISMATCH')
    })

    it.each([
      ['a data: URL', `data:image/jpeg;base64,${base64(JPEG_HEADER)}`],
      ['characters outside the base64 alphabet', '/9j/ 4AAQ*Skb'],
      ['base64 without padding', base64([0xff, 0xd8, 0xff, 0xe0]).replace(/=+$/, '')],
      ['base64url', '_9j_4AA-'],
    ])('%s', async (_label, data) => {
      expect(await attempt({ contentType: 'image/jpeg', data })).toBe('INVALID_ENCODING')
    })

    it('an empty payload', async () => {
      expect(await attempt({ contentType: 'image/jpeg', data: '' })).toBe('EMPTY')
    })

    it('a content type outside JPEG, PNG and WebP', async () => {
      const input = { contentType: 'image/svg+xml', data: base64(JPEG_HEADER) } as unknown as UploadAvatarInput
      expect(await attempt(input)).toBe('UNSUPPORTED_TYPE')
    })
  })

  it('never puts the payload in the error message', async () => {
    const data = base64(PNG_HEADER)
    const error = await new ProfileUseCases(makeRepo(), makeStorage())
      .updateAvatar('user-1', { contentType: 'image/jpeg', data })
      .catch((err: Error) => err)
    expect((error as Error).message).not.toContain(data)
  })

  it('throws UserNotFoundError when the user does not exist, without storing anything', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const storage = makeStorage()
    await expect(
      new ProfileUseCases(repo, storage).updateAvatar('gone', { contentType: 'image/jpeg', data: base64(JPEG_HEADER) })
    ).rejects.toThrow(UserNotFoundError)
    expect(storage.save).not.toHaveBeenCalled()
  })

  it('drops the picture it just stored when the account disappears meanwhile', async () => {
    const repo = makeRepo({ replaceAvatar: vi.fn().mockResolvedValue(null) })
    const storage = makeStorage()
    await expect(
      new ProfileUseCases(repo, storage).updateAvatar('user-1', {
        contentType: 'image/jpeg',
        data: base64(JPEG_HEADER),
      })
    ).rejects.toThrow(UserNotFoundError)
    expect(storage.delete).toHaveBeenCalledExactlyOnceWith('image-2')
  })
})

describe('ProfileUseCases.removeAvatar', () => {
  it('clears the avatar and deletes the picture it pointed at', async () => {
    const repo = makeRepoWithAvatar('/images/image-1')
    const storage = makeStorage()

    const result = await new ProfileUseCases(repo, storage).removeAvatar('user-1')

    expect(repo.replaceAvatar).toHaveBeenCalledWith('user-1', null)
    expect(storage.deleteByOwnerAndUrl).toHaveBeenCalledExactlyOnceWith('user-1', '/images/image-1')
    expect(storage.deleteByOwner).not.toHaveBeenCalled()
    expect(result.avatar).toBeNull()
  })

  it('is idempotent: succeeds when there is no avatar, without deleting anything', async () => {
    const storage = makeStorage()
    const result = await new ProfileUseCases(makeRepo(), storage).removeAvatar('user-1')
    expect(result.avatar).toBeNull()
    expect(storage.deleteByOwnerAndUrl).not.toHaveBeenCalled()
  })

  it('throws UserNotFoundError when the user does not exist, without deleting anything', async () => {
    const repo = makeRepo({ replaceAvatar: vi.fn().mockResolvedValue(null) })
    const storage = makeStorage()
    await expect(new ProfileUseCases(repo, storage).removeAvatar('gone')).rejects.toThrow(UserNotFoundError)
    expect(storage.deleteByOwnerAndUrl).not.toHaveBeenCalled()
    expect(storage.deleteByOwner).not.toHaveBeenCalled()
  })
})

/**
 * Concurrency: two tabs, two devices or a network retry make the same user run these use cases at the same
 * time. The doubles below share one account (the `avatar` pointer and the stored pictures) and hand control
 * back to the test before every port call, so a test decides which call goes next.
 */
type Turn = () => Promise<void>
type Call = (useCases: ProfileUseCases) => Promise<unknown>

const urlOf = (id: string): string => `/images/${id}`

const makeAccount = (initialAvatar: string | null = null) => {
  const state = { avatar: initialAvatar, images: new Set<string>(initialAvatar ? [initialAvatar] : []), saved: 0 }

  /** Ports of one request: each call waits for its turn, then applies in one go, as the ports promise to. */
  const useCasesFor = (turn: Turn): ProfileUseCases => {
    const profile = (): UserProfile => ({ ...mockUser, avatar: state.avatar })
    const repo = makeRepo({
      findById: async () => {
        await turn()
        return profile()
      },
      replaceAvatar: async (_id, avatar) => {
        await turn()
        const previousAvatar = state.avatar
        state.avatar = avatar
        return { user: profile(), previousAvatar }
      },
    })
    const storage = makeStorage({
      save: async () => {
        await turn()
        state.saved += 1
        const id = `new-${state.saved}`
        state.images.add(urlOf(id))
        return { id, url: urlOf(id) }
      },
      delete: async id => {
        await turn()
        state.images.delete(urlOf(id))
      },
      deleteByOwner: async () => {
        await turn()
        state.images.clear()
      },
      deleteByOwnerAndUrl: async (_ownerId, url) => {
        await turn()
        state.images.delete(url)
      },
    })
    return new ProfileUseCases(repo, storage)
  }

  return { state, useCasesFor }
}

/** Lets pending calls run until each one is either finished or waiting for its turn. */
const settle = (): Promise<void> => new Promise(resolve => setImmediate(resolve))

/**
 * Starts every call at once on the same account, then lets them through one port call at a time, in the order
 * given by `schedule` (names of the calls). Reports the calls still waiting once the schedule is exhausted.
 */
const interleave = async (account: ReturnType<typeof makeAccount>, calls: Record<string, Call>, schedule: string[]) => {
  const waiting = new Map<string, () => void>()
  const running = Object.entries(calls).map(([name, call]) =>
    call(account.useCasesFor(() => new Promise<void>(resolve => waiting.set(name, resolve))))
  )
  for (const name of schedule) {
    await settle()
    const go = waiting.get(name)
    if (!go) {
      throw new Error(`"${name}" has no port call left to make (schedule: ${schedule.join(' ')})`)
    }
    waiting.delete(name)
    go()
  }
  await settle()
  return { waiting: [...waiting.keys()], results: Promise.all(running) }
}

/** Runs the scenario once per possible interleaving of its calls; returns how many there were. */
const forEveryInterleaving = async (
  scenario: () => { account: ReturnType<typeof makeAccount>; calls: Record<string, Call> },
  check: (state: ReturnType<typeof makeAccount>['state'], schedule: string) => void,
  schedule: string[] = []
): Promise<number> => {
  const { account, calls } = scenario()
  const { waiting, results } = await interleave(account, calls, schedule)
  if (waiting.length === 0) {
    await results
    check(account.state, schedule.join(' '))
    return 1
  }
  let count = 0
  for (const name of waiting) {
    count += await forEveryInterleaving(scenario, check, [...schedule, name])
  }
  return count
}

const upload: Call = useCases =>
  useCases.updateAvatar('user-1', { contentType: 'image/jpeg', data: base64(JPEG_HEADER) })
const remove: Call = useCases => useCases.removeAvatar('user-1')

describe('ProfileUseCases — concurrent requests of the same user', () => {
  /** The rule of issue #55: whatever happened, the profile shows an existing picture or none. */
  const expectAvatarToResolve = (state: ReturnType<typeof makeAccount>['state'], schedule: string) => {
    const dangling = state.avatar !== null && !state.images.has(state.avatar)
    expect(dangling, `avatar ${state.avatar} points at a deleted picture after: ${schedule}`).toBe(false)
  }
  const expectNoOrphan = (state: ReturnType<typeof makeAccount>['state'], schedule: string) => {
    const expected = state.avatar === null ? [] : [state.avatar]
    expect([...state.images], `pictures left after: ${schedule}`).toEqual(expected)
  }

  it('two uploads taking turns at every step leave an avatar that still exists', async () => {
    const account = makeAccount('/images/old')

    // A and B both save, both point the profile at their picture (B last), then both clean up.
    const { waiting, results } = await interleave(account, { A: upload, B: upload }, [
      'A',
      'B',
      'A',
      'B',
      'A',
      'B',
      'A',
      'B',
    ])
    await results

    expect(waiting).toEqual([])
    expect(account.state.avatar).toBe('/images/new-2')
    expect([...account.state.images]).toEqual(['/images/new-2'])
  })

  it.each<[string, string | null, Record<string, Call>]>([
    ['two uploads, no picture yet', null, { A: upload, B: upload }],
    ['two uploads replacing a picture', '/images/old', { A: upload, B: upload }],
    ['an upload and a removal', '/images/old', { A: upload, R: remove }],
    ['an upload and a removal, no picture yet', null, { A: upload, R: remove }],
    ['two removals', '/images/old', { R: remove, S: remove }],
  ])('%s: no interleaving leaves a dangling avatar or an orphan picture', async (_label, initialAvatar, calls) => {
    const count = await forEveryInterleaving(
      () => ({ account: makeAccount(initialAvatar), calls }),
      (state, schedule) => {
        expectAvatarToResolve(state, schedule)
        expectNoOrphan(state, schedule)
      }
    )
    // Guards the harness itself: a single schedule would mean the calls never actually interleaved.
    expect(count).toBeGreaterThan(1)
  })
})
