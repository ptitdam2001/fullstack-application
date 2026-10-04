import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { UserProfile } from '../../user/domain/User.js'
import type { LoginResult, TokenPayload } from '../domain/User.js'
import {
  InvalidCredentialsError,
  AccountBlockedError,
  AccountInactiveError,
  UnauthorizedError,
  WeakPasswordError,
  WrongCurrentPasswordError,
} from '../domain/AuthErrors.js'
import { isPasswordValid } from '../domain/PasswordPolicy.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

const getMaxLoginAttempts = (): number => parseInt(process.env.MAX_LOGIN_ATTEMPTS ?? '5')
const getLockoutMinutes = (): number => Number(process.env.LOGIN_LOCKOUT_MINUTES) || 15

export type UserProfileWithRoles = UserProfile

export class AuthUseCases {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  // Lazily hashed once: lets an unknown email cost one bcrypt comparison like a known one.
  private dummyHash?: Promise<string>

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= this.authService.hashPassword(crypto.randomUUID())
    return this.dummyHash
  }

  // Credentials first, account state after (spec 10, "Anti-énumération à la connexion"):
  // unknown email and wrong password are indistinguishable, and blocked/inactive
  // are only revealed to someone who knows the password.
  async login(email: string, password: string): Promise<LoginResult> {
    let user = await this.userRepo.findByEmailWithPassword(email)
    if (!user) {
      await this.authService.comparePassword(password, await this.getDummyHash())
      throw new InvalidCredentialsError()
    }

    // An expired lock restarts the counter before the attempt is handled (spec 10).
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await this.userRepo.resetLoginAttempts(user.id)
      user = { ...user, loginAttempts: 0, lockedUntil: null }
    }

    const isMatch = await this.authService.comparePassword(password, user.password)
    if (!isMatch) {
      if (user.isActive && !user.isBlocked) {
        const attempts = await this.userRepo.incrementLoginAttempts(user.id)
        if (attempts >= getMaxLoginAttempts()) {
          await this.userRepo.lockUntil(user.id, new Date(Date.now() + getLockoutMinutes() * 60_000))
        }
      }
      throw new InvalidCredentialsError()
    }

    if (user.isBlocked) {
      throw new AccountBlockedError()
    }
    if (!user.isActive) {
      throw new AccountInactiveError()
    }

    // Only consecutive failures count towards the lock (spec 10).
    if (user.loginAttempts > 0) {
      await this.userRepo.resetLoginAttempts(user.id)
    }

    const token = this.authService.generateToken(user.id, user.isAdmin, user.roles.includes('COACH'))
    return { userId: user.id, email: user.email, isAdmin: user.isAdmin, token }
  }

  // The JWT only proves who the caller is. Rights and account state are read from the database on every
  // request, so a block, demotion, coach removal or deletion takes effect immediately (spec 10, Sécurité › Sessions).
  async authenticate(token: string): Promise<TokenPayload> {
    const claims = this.authService.verifyToken(token)
    const state = await this.userRepo.findAuthState(claims.userId)
    if (!state || !state.isActive || state.isBlocked) {
      throw new UnauthorizedError()
    }
    // iat has whole-second precision, so compare in seconds: a token issued in the same second as the reset
    // (e.g. the login right after it) stays valid. A token without iat cannot be dated: refuse it.
    if (
      state.tokensValidAfter &&
      !(claims.iat !== undefined && claims.iat >= Math.floor(state.tokensValidAfter.getTime() / 1000))
    ) {
      throw new UnauthorizedError()
    }
    return { userId: claims.userId, isAdmin: state.isAdmin, isCoach: state.isCoach, iat: claims.iat, exp: claims.exp }
  }

  async me(userId: string): Promise<UserProfileWithRoles> {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    // Contextual roles are resolved by the user repository, same as GET /users (spec 06)
    return user
  }

  /**
   * Changes the password of a signed-in user. Every token issued before the change is revoked, the one
   * of this very request included, so a fresh one is returned to keep the caller signed in.
   *
   * Wrong current passwords count like failed logins (same counter, same threshold): whoever holds an
   * open session must not be able to guess the password at will. At the threshold the account is locked
   * for the usual duration AND every session is signed out — a lock alone only stops new logins, it
   * would leave the guessing session alive.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<LoginResult> {
    const user = await this.userRepo.findByIdWithPassword(userId)
    if (!user) {
      throw new UserNotFoundError()
    }
    // Current password first: the rules of the new one are only discussed with someone who knows it.
    if (!(await this.authService.comparePassword(currentPassword, user.password))) {
      const attempts = await this.userRepo.incrementLoginAttempts(userId)
      if (attempts >= getMaxLoginAttempts()) {
        const now = new Date()
        await this.userRepo.lockUntil(userId, new Date(now.getTime() + getLockoutMinutes() * 60_000))
        await this.userRepo.revokeTokens(userId, now)
        // The session no longer exists: this is the one case where the route answers 401.
        throw new UnauthorizedError()
      }
      throw new WrongCurrentPasswordError()
    }
    if (!isPasswordValid(newPassword)) {
      throw new WeakPasswordError()
    }

    const hashed = await this.authService.hashPassword(newPassword)
    // Revocation date taken BEFORE the token is signed: `authenticate` accepts a token whose iat (whole
    // seconds) is not older than this date floored to the second, so the fresh token always passes.
    await this.userRepo.changePassword(userId, hashed, new Date())

    const token = this.authService.generateToken(user.id, user.isAdmin, user.roles.includes('COACH'))
    return { userId: user.id, email: user.email, isAdmin: user.isAdmin, token }
  }
}
