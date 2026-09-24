import { describe, it, expect, vi } from 'vitest'
import { UserUseCases } from './UserUseCases.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import { CannotSelfDeleteError, CannotSelfDemoteError, UserNotFoundError } from '../domain/UserErrors.js'
import type { UserProfile } from '../domain/User.js'

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
  findAll: vi.fn().mockResolvedValue([mockUser]),
  count: vi.fn().mockResolvedValue(1),
  create: vi.fn().mockResolvedValue(mockUser),
  update: vi.fn().mockResolvedValue({ ...mockUser, firstName: 'Updated' }),
  delete: vi.fn().mockResolvedValue(undefined),
  incrementLoginAttempts: vi.fn().mockResolvedValue(1),
  lockUntil: vi.fn().mockResolvedValue(undefined),
  resetLoginAttempts: vi.fn().mockResolvedValue(undefined),
  findAuthState: vi.fn().mockResolvedValue(null),
  ...overrides,
})

const hashFn = vi.fn().mockResolvedValue('hashed-password')

describe('UserUseCases.getAll', () => {
  it('returns all users', async () => {
    const users = await new UserUseCases(makeRepo()).getAll()
    expect(users).toHaveLength(1)
    expect(users[0].id).toBe('user-1')
  })

  it('passes undefined filter to repo when none provided', () => {
    const repo = makeRepo()
    new UserUseCases(repo).getAll()
    expect(repo.findAll).toHaveBeenCalledWith(undefined)
  })

  it('passes filter to repo when provided', () => {
    const repo = makeRepo()
    new UserUseCases(repo).getAll({ isActive: false })
    expect(repo.findAll).toHaveBeenCalledWith({ isActive: false })
  })

  it('forwards pagination alongside the filter to the repo', async () => {
    const repo = makeRepo()
    await new UserUseCases(repo).getAll({ isActive: true, pagination: { page: 1, limit: 10 } })
    expect(repo.findAll).toHaveBeenCalledWith({ isActive: true, pagination: { page: 1, limit: 10 } })
  })

  it('returned user profile with exposed roles', async () => {
    const users = await new UserUseCases(makeRepo()).getAll()
    expect(users[0].roles).toBeDefined()
    expect(users[0].roles).toEqual([])
  })
})

describe('UserUseCases.count', () => {
  it('returns the repository count', async () => {
    expect(await new UserUseCases(makeRepo()).count()).toBe(1)
  })

  it('forwards the isActive filter to the repo', async () => {
    const repo = makeRepo()
    await new UserUseCases(repo).count({ isActive: false })
    expect(repo.count).toHaveBeenCalledWith({ isActive: false })
  })
})

describe('UserUseCases.getById', () => {
  it('returns user when found', async () => {
    const user = await new UserUseCases(makeRepo()).getById('user-1')
    expect(user.email).toBe('bob@example.com')
  })

  it('throws UserNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new UserUseCases(repo).getById('unknown')).rejects.toThrow(UserNotFoundError)
  })
})

describe('UserUseCases.create', () => {
  it('hashes password before creating user', async () => {
    const repo = makeRepo()
    await new UserUseCases(repo).create({ firstName: 'Bob', email: 'bob@example.com', password: 'plain' }, hashFn)
    expect(hashFn).toHaveBeenCalledWith('plain')
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed-password' }))
  })
})

const ADMIN_ID = 'admin-1'

describe('UserUseCases.update', () => {
  it('updates user when found', async () => {
    const result = await new UserUseCases(makeRepo()).update('user-1', { firstName: 'Updated' }, ADMIN_ID)
    expect(result.firstName).toBe('Updated')
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new UserUseCases(repo).update('unknown', { firstName: 'X' }, ADMIN_ID)).rejects.toThrow(
      UserNotFoundError
    )
  })

  describe('isAdmin', () => {
    it('promotes another user to admin', async () => {
      const repo = makeRepo()
      await new UserUseCases(repo).update('user-1', { isAdmin: true }, ADMIN_ID)
      expect(repo.update).toHaveBeenCalledWith('user-1', { isAdmin: true })
    })

    it('revokes the admin role of another admin', async () => {
      const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, id: 'admin-2', isAdmin: true }) })
      await new UserUseCases(repo).update('admin-2', { isAdmin: false }, ADMIN_ID)
      expect(repo.update).toHaveBeenCalledWith('admin-2', { isAdmin: false })
    })

    it('refuses an admin revoking their own admin role, without writing', async () => {
      const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, id: ADMIN_ID, isAdmin: true }) })
      await expect(new UserUseCases(repo).update(ADMIN_ID, { isAdmin: false }, ADMIN_ID)).rejects.toThrow(
        CannotSelfDemoteError
      )
      expect(repo.update).not.toHaveBeenCalled()
    })

    it('lets an admin edit their own profile when isAdmin is not revoked', async () => {
      const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, id: ADMIN_ID, isAdmin: true }) })
      await new UserUseCases(repo).update(ADMIN_ID, { firstName: 'Me', isAdmin: true }, ADMIN_ID)
      expect(repo.update).toHaveBeenCalledWith(ADMIN_ID, { firstName: 'Me', isAdmin: true })
    })
  })
})

describe('UserUseCases.delete', () => {
  it('deletes user when found', async () => {
    const repo = makeRepo()
    await new UserUseCases(repo).delete('user-1', ADMIN_ID)
    expect(repo.delete).toHaveBeenCalledWith('user-1')
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new UserUseCases(repo).delete('unknown', ADMIN_ID)).rejects.toThrow(UserNotFoundError)
  })

  it('deletes another admin', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, id: 'admin-2', isAdmin: true }) })
    await new UserUseCases(repo).delete('admin-2', ADMIN_ID)
    expect(repo.delete).toHaveBeenCalledWith('admin-2')
  })

  it('refuses an admin deleting their own account, without writing', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockUser, id: ADMIN_ID, isAdmin: true }) })
    await expect(new UserUseCases(repo).delete(ADMIN_ID, ADMIN_ID)).rejects.toThrow(CannotSelfDeleteError)
    expect(repo.delete).not.toHaveBeenCalled()
  })
})
