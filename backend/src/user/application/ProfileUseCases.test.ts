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
  delete: vi.fn(),
  incrementLoginAttempts: vi.fn(),
  lockUntil: vi.fn(),
  resetLoginAttempts: vi.fn(),
  findAuthState: vi.fn(),
  changePassword: vi.fn(),
  ...overrides,
})

const makeStorage = (overrides: Partial<IImageStorage> = {}): IImageStorage => ({
  save: vi.fn().mockResolvedValue({ id: 'image-2', url: '/images/image-2' }),
  findById: vi.fn(),
  delete: vi.fn().mockResolvedValue(undefined),
  deleteByOwner: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0]
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const WEBP_HEADER = [0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]

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
    expect(repo.update).toHaveBeenCalledWith('user-1', { avatar: '/images/image-2' })
    expect(result.avatar).toBe('/images/image-2')
  })

  it('deletes the previous pictures of the user, sparing the new one, once the profile points at it', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, avatar: '/images/image-1' }) })
    const storage = makeStorage()

    await new ProfileUseCases(repo, storage).updateAvatar('user-1', {
      contentType: 'image/jpeg',
      data: base64(JPEG_HEADER),
    })

    expect(storage.deleteByOwner).toHaveBeenCalledWith('user-1', { exceptId: 'image-2' })
    const order = (fn: unknown) => vi.mocked(fn as () => void).mock.invocationCallOrder[0]
    expect(order(storage.save)).toBeLessThan(order(repo.update))
    expect(order(repo.update)).toBeLessThan(order(storage.deleteByOwner))
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
      expect(storage.deleteByOwner).not.toHaveBeenCalled()
      expect(repo.update).not.toHaveBeenCalled()
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
})

describe('ProfileUseCases.removeAvatar', () => {
  it('clears the avatar and deletes the stored pictures of the user', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, avatar: '/images/image-1' }) })
    const storage = makeStorage()

    const result = await new ProfileUseCases(repo, storage).removeAvatar('user-1')

    expect(repo.update).toHaveBeenCalledWith('user-1', { avatar: null })
    expect(storage.deleteByOwner).toHaveBeenCalledWith('user-1')
    expect(result.avatar).toBeNull()
  })

  it('is idempotent: succeeds when there is no avatar', async () => {
    const result = await new ProfileUseCases(makeRepo(), makeStorage()).removeAvatar('user-1')
    expect(result.avatar).toBeNull()
  })

  it('throws UserNotFoundError when the user does not exist, without writing', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const storage = makeStorage()
    await expect(new ProfileUseCases(repo, storage).removeAvatar('gone')).rejects.toThrow(UserNotFoundError)
    expect(repo.update).not.toHaveBeenCalled()
    expect(storage.deleteByOwner).not.toHaveBeenCalled()
  })
})
