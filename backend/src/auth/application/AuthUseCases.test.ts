import { describe, it, expect, vi } from 'vitest'
import { AuthUseCases } from './AuthUseCases.js'
import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { IUserTeamRepository } from '../../userTeam/ports/IUserTeamRepository.js'
import type { IUserMatchRepository } from '../../userMatch/ports/IUserMatchRepository.js'
import { InvalidCredentialsError, AccountBlockedError, AccountInactiveError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'

const mockUser = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice@example.com',
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  loginAttempts: 0,
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
  incrementLoginAttempts: vi.fn().mockResolvedValue(1),
  blockUser: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeAuthService = (overrides: Partial<IAuthService> = {}): IAuthService => ({
  generateToken: vi.fn().mockReturnValue('jwt-token'),
  verifyToken: vi.fn(),
  hashPassword: vi.fn().mockResolvedValue('hashed'),
  comparePassword: vi.fn().mockResolvedValue(true),
  ...overrides,
})

const makeUserTeamRepo = (overrides: Partial<IUserTeamRepository> = {}): IUserTeamRepository => ({
  assign: vi.fn(),
  remove: vi.fn(),
  findByTeamAndRole: vi.fn().mockResolvedValue([]),
  findByUserAndRole: vi.fn().mockResolvedValue([]),
  hasRole: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeUserMatchRepo = (overrides: Partial<IUserMatchRepository> = {}): IUserMatchRepository => ({
  assign: vi.fn(),
  remove: vi.fn(),
  findByMatch: vi.fn().mockResolvedValue([]),
  findByUser: vi.fn().mockResolvedValue([]),
  isReferee: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeUseCases = (
  userRepo?: Partial<IUserRepository>,
  authService?: Partial<IAuthService>,
  userTeamRepo?: Partial<IUserTeamRepository>,
  userMatchRepo?: Partial<IUserMatchRepository>
) =>
  new AuthUseCases(
    makeRepo(userRepo),
    makeAuthService(authService),
    makeUserTeamRepo(userTeamRepo),
    makeUserMatchRepo(userMatchRepo)
  )

describe('AuthUseCases.login', () => {
  it('returns token when credentials are valid', async () => {
    const result = await makeUseCases().login('alice@example.com', 'password')
    expect(result.token).toBe('jwt-token')
    expect(result.userId).toBe('user-1')
    expect(result.isAdmin).toBe(false)
  })

  it('throws UserNotFoundError when email does not exist', async () => {
    await expect(
      makeUseCases({ findByEmailWithPassword: vi.fn().mockResolvedValue(null) }).login('unknown@example.com', 'x')
    ).rejects.toThrow(UserNotFoundError)
  })

  it('throws AccountBlockedError when account is blocked', async () => {
    await expect(
      makeUseCases({ findByEmailWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed', isBlocked: true }) }).login(
        'alice@example.com',
        'password'
      )
    ).rejects.toThrow(AccountBlockedError)
  })

  it('throws AccountInactiveError when account is not active', async () => {
    await expect(
      makeUseCases({ findByEmailWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed', isActive: false }) }).login(
        'alice@example.com',
        'password'
      )
    ).rejects.toThrow(AccountInactiveError)
  })

  it('throws InvalidCredentialsError and increments attempts on wrong password', async () => {
    const repo = makeRepo({ comparePassword: vi.fn() })
    const uc = makeUseCases(repo, { comparePassword: vi.fn().mockResolvedValue(false) })
    await expect(uc.login('alice@example.com', 'wrong')).rejects.toThrow(InvalidCredentialsError)
    expect(repo.incrementLoginAttempts).toHaveBeenCalledWith('user-1')
  })

  it('blocks account and throws AccountBlockedError when attempts reach max', async () => {
    const repo = makeRepo({ incrementLoginAttempts: vi.fn().mockResolvedValue(5) })
    const uc = makeUseCases(repo, { comparePassword: vi.fn().mockResolvedValue(false) })
    await expect(uc.login('alice@example.com', 'wrong')).rejects.toThrow(AccountBlockedError)
    expect(repo.blockUser).toHaveBeenCalledWith('user-1')
  })

  it('calls generateToken with userId and isAdmin', async () => {
    const authService = makeAuthService()
    await new AuthUseCases(makeRepo(), authService, makeUserTeamRepo(), makeUserMatchRepo()).login('alice@example.com', 'password')
    expect(authService.generateToken).toHaveBeenCalledWith('user-1', false)
  })
})

describe('AuthUseCases.me', () => {
  it('returns user profile with empty roles when user has no team or match', async () => {
    const user = await makeUseCases().me('user-1')
    expect(user.id).toBe('user-1')
    expect(user.email).toBe('alice@example.com')
    expect(user.roles).toEqual([])
  })

  it('includes ADMIN role when user isAdmin', async () => {
    const user = await makeUseCases({ findById: vi.fn().mockResolvedValue({ ...mockUser, isAdmin: true }) }).me('user-1')
    expect(user.roles).toContain('ADMIN')
  })

  it('includes REFEREE role when user isReferee', async () => {
    const user = await makeUseCases({ findById: vi.fn().mockResolvedValue({ ...mockUser, isReferee: true }) }).me('user-1')
    expect(user.roles).toContain('REFEREE')
  })

  it('includes COACH role when user has coach team', async () => {
    const coachEntry = { id: 'ut-1', userId: 'user-1', teamId: 'team-1', role: TeamRole.COACH }
    const user = await makeUseCases(
      undefined,
      undefined,
      { findByUserAndRole: vi.fn().mockImplementation((_, role) => Promise.resolve(role === TeamRole.COACH ? [coachEntry] : [])) }
    ).me('user-1')
    expect(user.roles).toContain('COACH')
    expect(user.roles).not.toContain('PLAYER')
  })

  it('includes PLAYER role when user has player team', async () => {
    const playerEntry = { id: 'ut-2', userId: 'user-1', teamId: 'team-1', role: TeamRole.PLAYER }
    const user = await makeUseCases(
      undefined,
      undefined,
      { findByUserAndRole: vi.fn().mockImplementation((_, role) => Promise.resolve(role === TeamRole.PLAYER ? [playerEntry] : [])) }
    ).me('user-1')
    expect(user.roles).toContain('PLAYER')
    expect(user.roles).not.toContain('COACH')
  })

  it('includes REFEREE role from match assignments when isReferee is false', async () => {
    const matchEntry = { id: 'um-1', userId: 'user-1', matchId: 'match-1' }
    const user = await makeUseCases(undefined, undefined, undefined, {
      findByUser: vi.fn().mockResolvedValue([matchEntry]),
    }).me('user-1')
    expect(user.roles).toContain('REFEREE')
  })

  it('does not duplicate REFEREE role when isReferee and has match assignments', async () => {
    const matchEntry = { id: 'um-1', userId: 'user-1', matchId: 'match-1' }
    const user = await makeUseCases(
      { findById: vi.fn().mockResolvedValue({ ...mockUser, isReferee: true }) },
      undefined,
      undefined,
      { findByUser: vi.fn().mockResolvedValue([matchEntry]) }
    ).me('user-1')
    expect(user.roles.filter((r) => r === 'REFEREE')).toHaveLength(1)
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    await expect(makeUseCases({ findById: vi.fn().mockResolvedValue(null) }).me('unknown-id')).rejects.toThrow(UserNotFoundError)
  })
})