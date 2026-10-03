import { afterEach, describe, it, expect, vi } from 'vitest'
import { AuthUseCases } from './AuthUseCases.js'
import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import {
  InvalidCredentialsError,
  AccountBlockedError,
  AccountInactiveError,
  UnauthorizedError,
  WeakPasswordError,
  WrongCurrentPasswordError,
} from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'
import { JwtAuthService } from '../infrastructure/JwtAuthService.js'
import type { AuthState } from '../../user/domain/User.js'

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
  roles: [],
}

const makeRepo = (overrides: Partial<IUserRepository> = {}): IUserRepository => ({
  findById: vi.fn().mockResolvedValue(mockUser),
  findByEmailWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed' }),
  findByIdWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'hashed' }),
  findAll: vi.fn().mockResolvedValue([mockUser]),
  count: vi.fn().mockResolvedValue(1),
  update: vi.fn().mockResolvedValue(mockUser),
  delete: vi.fn().mockResolvedValue(undefined),
  incrementLoginAttempts: vi.fn().mockResolvedValue(1),
  lockUntil: vi.fn().mockResolvedValue(undefined),
  resetLoginAttempts: vi.fn().mockResolvedValue(undefined),
  findAuthState: vi
    .fn()
    .mockResolvedValue({ isAdmin: false, isActive: true, isBlocked: false, isCoach: false, tokensValidAfter: null }),
  changePassword: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeAuthService = (overrides: Partial<IAuthService> = {}): IAuthService => ({
  generateToken: vi.fn().mockReturnValue('jwt-token'),
  verifyToken: vi.fn(),
  hashPassword: vi.fn().mockResolvedValue('hashed'),
  comparePassword: vi.fn().mockResolvedValue(true),
  ...overrides,
})

const makeUseCases = (userRepo?: Partial<IUserRepository>, authService?: Partial<IAuthService>) =>
  new AuthUseCases(makeRepo(userRepo), makeAuthService(authService))

describe('AuthUseCases.login', () => {
  const withUser = (extra: Record<string, unknown> = {}) => ({
    findByEmailWithPassword: vi
      .fn()
      .mockResolvedValue({ ...mockUser, password: 'hashed', lockedUntil: null, ...extra }),
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
      const uc = new AuthUseCases(makeRepo({ findByEmailWithPassword: vi.fn().mockResolvedValue(null) }), authService)
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
    await new AuthUseCases(makeRepo(), authService).login('alice@example.com', 'password')
    expect(authService.generateToken).toHaveBeenCalledWith('user-1', false, false)
  })

  it('derives isCoach from the roles resolved by the user repository', async () => {
    const authService = makeAuthService()
    await makeUseCases(withUser({ roles: ['COACH'] }), authService).login('alice@example.com', 'password')
    expect(authService.generateToken).toHaveBeenCalledWith('user-1', false, true)
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
      .mockResolvedValue(
        state && { isAdmin: false, isActive: true, isBlocked: false, isCoach: false, tokensValidAfter: null, ...state }
      ),
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

  describe('token revocation (tokensValidAfter)', () => {
    // withToken() claims iat = 100 (seconds since epoch)
    it('refuses a token issued before tokensValidAfter', async () => {
      const uc = makeUseCases(withState({ tokensValidAfter: new Date(200_000) }), withToken())
      await expect(uc.authenticate('jwt')).rejects.toThrow(UnauthorizedError)
    })

    it('accepts a token issued in the same second as tokensValidAfter (a login right after the reset)', async () => {
      const uc = makeUseCases(withState({ tokensValidAfter: new Date(100_500) }), withToken())
      await expect(uc.authenticate('jwt')).resolves.toMatchObject({ userId: 'user-1' })
    })

    it('accepts a token issued after tokensValidAfter', async () => {
      const uc = makeUseCases(withState({ tokensValidAfter: new Date(50_000) }), withToken())
      await expect(uc.authenticate('jwt')).resolves.toMatchObject({ userId: 'user-1' })
    })

    it('refuses a token without iat once a revocation date exists (fail closed)', async () => {
      const uc = makeUseCases(withState({ tokensValidAfter: new Date(50_000) }), withToken({ iat: undefined }))
      await expect(uc.authenticate('jwt')).rejects.toThrow(UnauthorizedError)
    })

    it('does not require iat when nothing was revoked', async () => {
      const uc = makeUseCases(withState({}), withToken({ iat: undefined }))
      await expect(uc.authenticate('jwt')).resolves.toMatchObject({ userId: 'user-1' })
    })
  })

  it('does not query the database when the token is invalid', async () => {
    const repo = makeRepo(withState({}))
    const invalid = {
      verifyToken: vi.fn().mockImplementation(() => {
        throw new Error('jwt expired')
      }),
    }
    await expect(makeUseCases(repo, invalid).authenticate('jwt')).rejects.toThrow('jwt expired')
    expect(repo.findAuthState).not.toHaveBeenCalled()
  })
})

describe('AuthUseCases.me', () => {
  it('returns the profile with the roles resolved by the user repository', async () => {
    const findById = vi.fn().mockResolvedValue({ ...mockUser, roles: ['COACH', 'REFEREE'] })

    const user = await makeUseCases({ findById }).me('user-1')

    expect(findById).toHaveBeenCalledWith('user-1')
    expect(user.id).toBe('user-1')
    expect(user.roles).toEqual(['COACH', 'REFEREE'])
  })

  it('throws UserNotFoundError when user does not exist', async () => {
    await expect(makeUseCases({ findById: vi.fn().mockResolvedValue(null) }).me('unknown-id')).rejects.toThrow(
      UserNotFoundError
    )
  })
})

describe('AuthUseCases.changePassword', () => {
  const withStoredPassword = (extra: Record<string, unknown> = {}) => ({
    findByIdWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: 'stored-hash', ...extra }),
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('stores the new hash, revokes the previous tokens and returns a fresh token', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-02T10:00:00.500Z'))
    const repo = { ...withStoredPassword(), changePassword: vi.fn().mockResolvedValue(undefined) }
    const authService = {
      comparePassword: vi.fn().mockResolvedValue(true),
      hashPassword: vi.fn().mockResolvedValue('new-hash'),
      generateToken: vi.fn().mockReturnValue('fresh-token'),
    }

    const result = await makeUseCases(repo, authService).changePassword('user-1', 'Current123', 'NewPassword1')

    expect(authService.comparePassword).toHaveBeenCalledWith('Current123', 'stored-hash')
    expect(authService.hashPassword).toHaveBeenCalledWith('NewPassword1')
    expect(repo.changePassword).toHaveBeenCalledWith('user-1', 'new-hash', new Date('2026-10-02T10:00:00.500Z'))
    expect(result).toEqual({ userId: 'user-1', email: 'alice@example.com', isAdmin: false, token: 'fresh-token' })
  })

  it('signs the fresh token after the password is stored', async () => {
    const repo = { ...withStoredPassword(), changePassword: vi.fn().mockResolvedValue(undefined) }
    const authService = { generateToken: vi.fn().mockReturnValue('fresh-token') }

    await makeUseCases(repo, authService).changePassword('user-1', 'Current123', 'NewPassword1')

    expect(repo.changePassword.mock.invocationCallOrder[0]).toBeLessThan(
      authService.generateToken.mock.invocationCallOrder[0]
    )
  })

  it('carries the current rights into the fresh token', async () => {
    const authService = { generateToken: vi.fn().mockReturnValue('fresh-token') }
    const repo = withStoredPassword({ isAdmin: true, roles: ['ADMIN', 'COACH'] })

    const result = await makeUseCases(repo, authService).changePassword('user-1', 'Current123', 'NewPassword1')

    expect(authService.generateToken).toHaveBeenCalledWith('user-1', true, true)
    expect(result.isAdmin).toBe(true)
  })

  it('refuses a wrong current password without writing', async () => {
    const repo = { ...withStoredPassword(), changePassword: vi.fn() }
    const authService = { comparePassword: vi.fn().mockResolvedValue(false), hashPassword: vi.fn() }

    await expect(makeUseCases(repo, authService).changePassword('user-1', 'Wrong123', 'NewPassword1')).rejects.toThrow(
      WrongCurrentPasswordError
    )
    expect(authService.hashPassword).not.toHaveBeenCalled()
    expect(repo.changePassword).not.toHaveBeenCalled()
  })

  it.each([
    ['shorter than 8 characters', 'Abc1'],
    ['without a digit', 'NewPassword'],
    ['without an uppercase letter', 'newpassword1'],
  ])('refuses a new password %s without writing (spec 10)', async (_label, newPassword) => {
    const repo = { ...withStoredPassword(), changePassword: vi.fn() }

    await expect(makeUseCases(repo).changePassword('user-1', 'Current123', newPassword)).rejects.toThrow(
      WeakPasswordError
    )
    expect(repo.changePassword).not.toHaveBeenCalled()
  })

  it('reports a wrong current password before a weak new one', async () => {
    const authService = { comparePassword: vi.fn().mockResolvedValue(false) }

    await expect(
      makeUseCases(withStoredPassword(), authService).changePassword('user-1', 'Wrong123', 'weak')
    ).rejects.toThrow(WrongCurrentPasswordError)
  })

  it('throws UserNotFoundError when the user no longer exists', async () => {
    const repo = { findByIdWithPassword: vi.fn().mockResolvedValue(null) }

    await expect(makeUseCases(repo).changePassword('gone', 'Current123', 'NewPassword1')).rejects.toThrow(
      UserNotFoundError
    )
  })

  // Real JWTs against the real `authenticate`: iat has whole-second precision while tokensValidAfter has
  // milliseconds, so the fresh token must survive the revocation it was issued with.
  describe('token revocation, with real tokens', () => {
    const setUp = async () => {
      vi.stubEnv('JWT_SECRET', 'unit-test-secret-long-enough')
      const authService = new JwtAuthService()
      const state: AuthState = {
        isAdmin: false,
        isActive: true,
        isBlocked: false,
        isCoach: false,
        tokensValidAfter: null,
      }
      const storedHash = await authService.hashPassword('Current123')
      const repo = makeRepo({
        findByIdWithPassword: vi.fn().mockResolvedValue({ ...mockUser, password: storedHash }),
        findAuthState: vi.fn().mockImplementation(async () => state),
        changePassword: vi.fn().mockImplementation(async (_id: string, _hash: string, tokensValidAfter: Date) => {
          state.tokensValidAfter = tokensValidAfter
        }),
      })
      return { authService, useCases: new AuthUseCases(repo, authService) }
    }

    it.each([
      ['at the very start of a second', '2026-10-02T10:00:00.000Z'],
      ['at the very end of a second', '2026-10-02T10:00:00.999Z'],
    ])('accepts the fresh token when the change happens %s', async (_label, now) => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(now))
      const { useCases } = await setUp()

      const { token } = await useCases.changePassword('user-1', 'Current123', 'NewPassword1')

      await expect(useCases.authenticate(token)).resolves.toMatchObject({ userId: 'user-1' })
    })

    it('refuses a token issued before the change', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-10-02T09:59:00.000Z'))
      const { authService, useCases } = await setUp()
      const oldToken = authService.generateToken('user-1', false, false)
      await expect(useCases.authenticate(oldToken)).resolves.toMatchObject({ userId: 'user-1' })

      vi.setSystemTime(new Date('2026-10-02T10:00:00.500Z'))
      const { token } = await useCases.changePassword('user-1', 'Current123', 'NewPassword1')

      await expect(useCases.authenticate(oldToken)).rejects.toThrow(UnauthorizedError)
      await expect(useCases.authenticate(token)).resolves.toMatchObject({ userId: 'user-1' })
    })
  })
})
