import { describe, it, expect, vi } from 'vitest'
import { AuthUseCases } from './AuthUseCases.js'
import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { IUserTeamRepository } from '../../userTeam/ports/IUserTeamRepository.js'
import type { IUserMatchRepository } from '../../userMatch/ports/IUserMatchRepository.js'
import {
  InvalidCredentialsError,
  AccountBlockedError,
  AccountInactiveError,
  UnauthorizedError,
} from '../domain/AuthErrors.js'
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
  lockUntil: vi.fn().mockResolvedValue(undefined),
  resetLoginAttempts: vi.fn().mockResolvedValue(undefined),
  findAuthState: vi.fn().mockResolvedValue({ isAdmin: false, isActive: true, isBlocked: false, isCoach: false }),
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
  findByUser: vi.fn().mockResolvedValue([]),
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
  const withUser = (extra: Record<string, unknown> = {}) => ({
    findByEmailWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed', lockedUntil: null, ...extra }),
  })
  const wrongPassword = { comparePassword: vi.fn().mockResolvedValue(false) }

  it('returns token when credentials are valid', async () => {
    const result = await makeUseCases().login('alice@example.com', 'password')
    expect(result.token).toBe('jwt-token')
    expect(result.userId).toBe('user-1')
    expect(result.isAdmin).toBe(false)
  })

  describe('anti-enumeration (spec 10)', () => {
    it('throws InvalidCredentialsError, not UserNotFoundError, when email does not exist', async () => {
      await expect(
        makeUseCases({ findByEmailWithPassword: vi.fn().mockResolvedValue(null) }).login('unknown@example.com', 'x')
      ).rejects.toThrow(InvalidCredentialsError)
    })

    it('still runs a bcrypt comparison when email does not exist (equalises response time)', async () => {
      const authService = makeAuthService()
      const uc = new AuthUseCases(
        makeRepo({ findByEmailWithPassword: vi.fn().mockResolvedValue(null) }),
        authService,
        makeUserTeamRepo(),
        makeUserMatchRepo()
      )
      await expect(uc.login('unknown@example.com', 'x')).rejects.toThrow(InvalidCredentialsError)
      expect(authService.comparePassword).toHaveBeenCalledTimes(1)
      expect(authService.comparePassword).toHaveBeenCalledWith('x', expect.any(String))
    })

    it('throws InvalidCredentialsError on wrong password for a blocked account, without incrementing', async () => {
      const repo = makeRepo(withUser({ isBlocked: true }))
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.incrementLoginAttempts).not.toHaveBeenCalled()
    })

    it('throws InvalidCredentialsError on wrong password for an inactive account, without incrementing', async () => {
      const repo = makeRepo(withUser({ isActive: false }))
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.incrementLoginAttempts).not.toHaveBeenCalled()
    })

    it('reveals AccountBlockedError only with the correct password', async () => {
      await expect(makeUseCases(withUser({ isBlocked: true })).login('alice@example.com', 'password')).rejects.toThrow(
        AccountBlockedError
      )
    })

    it('reveals AccountInactiveError only with the correct password', async () => {
      await expect(makeUseCases(withUser({ isActive: false })).login('alice@example.com', 'password')).rejects.toThrow(
        AccountInactiveError
      )
    })

    it('reports blocked before inactive when both apply', async () => {
      await expect(
        makeUseCases(withUser({ isBlocked: true, isActive: false })).login('alice@example.com', 'password')
      ).rejects.toThrow(AccountBlockedError)
    })
  })

  describe('failed attempts', () => {
    it('throws InvalidCredentialsError and increments attempts on wrong password', async () => {
      const repo = makeRepo()
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.incrementLoginAttempts).toHaveBeenCalledWith('user-1')
    })

    it('locks the account for LOGIN_LOCKOUT_MINUTES when attempts reach max, still answering InvalidCredentialsError', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))
      try {
        const repo = makeRepo({ incrementLoginAttempts: vi.fn().mockResolvedValue(5) })
        await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
          InvalidCredentialsError
        )
        expect(repo.lockUntil).toHaveBeenCalledWith('user-1', new Date('2026-01-01T10:15:00Z'))
      } finally {
        vi.useRealTimers()
      }
    })

    it('does not block the account below the max', async () => {
      const repo = makeRepo({ incrementLoginAttempts: vi.fn().mockResolvedValue(4) })
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.lockUntil).not.toHaveBeenCalled()
    })
  })

  describe('temporary lockout (spec 10)', () => {
    const expired = () => new Date(Date.now() - 60_000)

    it('restarts the counter when the lock has expired, before handling the attempt', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 5, lockedUntil: expired() }))
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.resetLoginAttempts).toHaveBeenCalledWith('user-1')
      expect(repo.incrementLoginAttempts).toHaveBeenCalledWith('user-1')
    })

    it('lets the user in once the lock has expired and resets the counter only once', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 5, lockedUntil: expired() }))
      const result = await makeUseCases(repo).login('alice@example.com', 'password')
      expect(result.token).toBe('jwt-token')
      expect(repo.resetLoginAttempts).toHaveBeenCalledTimes(1)
    })

    it('does not extend an active lock on further failed attempts', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 5, isBlocked: true, lockedUntil: new Date(Date.now() + 60_000) }))
      await expect(makeUseCases(repo, wrongPassword).login('alice@example.com', 'wrong')).rejects.toThrow(
        InvalidCredentialsError
      )
      expect(repo.incrementLoginAttempts).not.toHaveBeenCalled()
      expect(repo.lockUntil).not.toHaveBeenCalled()
      expect(repo.resetLoginAttempts).not.toHaveBeenCalled()
    })
  })

  describe('consecutive failures only (spec 10)', () => {
    it('resets the counter after a successful login when it is above zero', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 3 }))
      await makeUseCases(repo).login('alice@example.com', 'password')
      expect(repo.resetLoginAttempts).toHaveBeenCalledWith('user-1')
    })

    it('does not touch the counter after a successful login when it is already zero', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 0 }))
      await makeUseCases(repo).login('alice@example.com', 'password')
      expect(repo.resetLoginAttempts).not.toHaveBeenCalled()
    })

    it('does not reset the counter when the account is blocked or inactive', async () => {
      const repo = makeRepo(withUser({ loginAttempts: 3, isBlocked: true }))
      await expect(makeUseCases(repo).login('alice@example.com', 'password')).rejects.toThrow(AccountBlockedError)
      expect(repo.resetLoginAttempts).not.toHaveBeenCalled()
    })
  })

  it('calls generateToken with userId, isAdmin, and isCoach', async () => {
    const authService = makeAuthService()
    await new AuthUseCases(makeRepo(), authService, makeUserTeamRepo(), makeUserMatchRepo()).login(
      'alice@example.com',
      'password'
    )
    expect(authService.generateToken).toHaveBeenCalledWith('user-1', false, false)
  })
})

describe('AuthUseCases.authenticate (spec 10, Sécurité › Sessions)', () => {
  const claims = { userId: 'user-1', isAdmin: true, isCoach: true, iat: 100, exp: 200 }
  const withToken = (overrides: Record<string, unknown> = {}) => ({
    verifyToken: vi.fn().mockReturnValue({ ...claims, ...overrides }),
  })
  const withState = (state: Record<string, unknown> | null) => ({
    findAuthState: vi
      .fn()
      .mockResolvedValue(state && { isAdmin: false, isActive: true, isBlocked: false, isCoach: false, ...state }),
  })

  it('takes roles from the database and ignores what the token claims', async () => {
    const payload = await makeUseCases(withState({}), withToken()).authenticate('jwt')
    expect(payload).toMatchObject({ userId: 'user-1', isAdmin: false, isCoach: false })
  })

  it('reflects a promotion made after the token was issued', async () => {
    const payload = await makeUseCases(withState({ isAdmin: true }), withToken({ isAdmin: false })).authenticate('jwt')
    expect(payload.isAdmin).toBe(true)
  })

  it('takes isCoach from the database', async () => {
    const payload = await makeUseCases(withState({ isCoach: true }), withToken({ isCoach: false })).authenticate('jwt')
    expect(payload.isCoach).toBe(true)
  })

  it('reads the state of the token owner', async () => {
    const repo = makeRepo(withState({}))
    await makeUseCases(repo, withToken()).authenticate('jwt')
    expect(repo.findAuthState).toHaveBeenCalledWith('user-1')
  })

  it.each([
    ['the account no longer exists', null],
    ['the account is inactive', { isActive: false }],
    ['the account is blocked', { isBlocked: true }],
  ])('throws UnauthorizedError when %s', async (_label, state) => {
    await expect(makeUseCases(withState(state), withToken()).authenticate('jwt')).rejects.toThrow(UnauthorizedError)
  })

  it('does not query the database when the token is invalid', async () => {
    const repo = makeRepo(withState({}))
    const invalid = { verifyToken: vi.fn().mockImplementation(() => { throw new Error('jwt expired') }) }
    await expect(makeUseCases(repo, invalid).authenticate('jwt')).rejects.toThrow('jwt expired')
    expect(repo.findAuthState).not.toHaveBeenCalled()
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