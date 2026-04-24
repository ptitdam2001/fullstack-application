import { describe, it, expect, vi } from 'vitest'
import { AuthUseCases } from './AuthUseCases.js'
import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import { InvalidCredentialsError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

const mockUser = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice@example.com',
  isAdmin: true,
  avatar: null,
  createdAt: new Date(),
}

const makeRepo = (overrides: Partial<IUserRepository> = {}): IUserRepository => ({
  findById: vi.fn().mockResolvedValue(mockUser),
  findByEmailWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed' }),
  findAll: vi.fn().mockResolvedValue([mockUser]),
  create: vi.fn().mockResolvedValue(mockUser),
  update: vi.fn().mockResolvedValue(mockUser),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeAuthService = (overrides: Partial<IAuthService> = {}): IAuthService => ({
  generateToken: vi.fn().mockReturnValue('jwt-token'),
  verifyToken: vi.fn(),
  hashPassword: vi.fn().mockResolvedValue('hashed'),
  comparePassword: vi.fn().mockResolvedValue(true),
  ...overrides,
})

describe('AuthUseCases.login', () => {
  it('returns token when credentials are valid', async () => {
    const result = await new AuthUseCases(makeRepo(), makeAuthService()).login('alice@example.com', 'password')
    expect(result.token).toBe('jwt-token')
    expect(result.userId).toBe('user-1')
    expect(result.isAdmin).toBe(true)
  })

  it('throws UserNotFoundError when email does not exist', async () => {
    const repo = makeRepo({ findByEmailWithPassword: vi.fn().mockResolvedValue(null) })
    await expect(new AuthUseCases(repo, makeAuthService()).login('unknown@example.com', 'x')).rejects.toThrow(
      UserNotFoundError
    )
  })

  it('throws InvalidCredentialsError when password does not match', async () => {
    const authService = makeAuthService({ comparePassword: vi.fn().mockResolvedValue(false) })
    await expect(new AuthUseCases(makeRepo(), authService).login('alice@example.com', 'wrong')).rejects.toThrow(
      InvalidCredentialsError
    )
  })

  it('calls generateToken with userId and isAdmin', async () => {
    const authService = makeAuthService()
    await new AuthUseCases(makeRepo(), authService).login('alice@example.com', 'password')
    expect(authService.generateToken).toHaveBeenCalledWith('user-1', true)
  })
})

describe('AuthUseCases.me', () => {
  it('returns user profile for valid userId', async () => {
    const user = await new AuthUseCases(makeRepo(), makeAuthService()).me('user-1')
    expect(user.id).toBe('user-1')
    expect(user.email).toBe('alice@example.com')
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AuthUseCases(repo, makeAuthService()).me('unknown-id')).rejects.toThrow(UserNotFoundError)
  })
})
