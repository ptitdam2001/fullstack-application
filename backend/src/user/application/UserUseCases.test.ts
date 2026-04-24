import { describe, it, expect, vi } from 'vitest'
import { UserUseCases } from './UserUseCases.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import { UserNotFoundError } from '../domain/UserErrors.js'

const mockUser = {
  id: 'user-1',
  firstName: 'Bob',
  lastName: 'Martin',
  email: 'bob@example.com',
  isAdmin: false,
  avatar: null,
  createdAt: new Date(),
}

const makeRepo = (overrides: Partial<IUserRepository> = {}): IUserRepository => ({
  findById: vi.fn().mockResolvedValue(mockUser),
  findByEmailWithPassword: vi.fn(),
  findAll: vi.fn().mockResolvedValue([mockUser]),
  create: vi.fn().mockResolvedValue(mockUser),
  update: vi.fn().mockResolvedValue({ ...mockUser, firstName: 'Updated' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const hashFn = vi.fn().mockResolvedValue('hashed-password')

describe('UserUseCases.getAll', () => {
  it('returns all users', async () => {
    const users = await new UserUseCases(makeRepo()).getAll()
    expect(users).toHaveLength(1)
    expect(users[0].id).toBe('user-1')
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

describe('UserUseCases.update', () => {
  it('updates user when found', async () => {
    const result = await new UserUseCases(makeRepo()).update('user-1', { firstName: 'Updated' })
    expect(result.firstName).toBe('Updated')
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new UserUseCases(repo).update('unknown', { firstName: 'X' })).rejects.toThrow(UserNotFoundError)
  })
})

describe('UserUseCases.delete', () => {
  it('deletes user when found', async () => {
    const repo = makeRepo()
    await new UserUseCases(repo).delete('user-1')
    expect(repo.delete).toHaveBeenCalledWith('user-1')
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new UserUseCases(repo).delete('unknown')).rejects.toThrow(UserNotFoundError)
  })
})
