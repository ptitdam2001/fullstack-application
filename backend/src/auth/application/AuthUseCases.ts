import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { UserProfile, UserRole } from '../../user/domain/User.js'
import type { LoginResult } from '../domain/User.js'
import type { IUserTeamRepository } from '../../userTeam/ports/IUserTeamRepository.js'
import type { IUserMatchRepository } from '../../userMatch/ports/IUserMatchRepository.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { InvalidCredentialsError, AccountBlockedError, AccountInactiveError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

const getMaxLoginAttempts = (): number => parseInt(process.env.MAX_LOGIN_ATTEMPTS ?? '5')
const getLockoutMinutes = (): number => Number(process.env.LOGIN_LOCKOUT_MINUTES) || 15

export type UserProfileWithRoles = UserProfile

export class AuthUseCases {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService,
    private readonly userTeamRepo: IUserTeamRepository,
    private readonly userMatchRepo: IUserMatchRepository
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

    const coachTeams = await this.userTeamRepo.findByUserAndRole(user.id, TeamRole.COACH)
    const isCoach = coachTeams.length > 0
    const token = this.authService.generateToken(user.id, user.isAdmin, isCoach)
    return { userId: user.id, email: user.email, isAdmin: user.isAdmin, token }
  }

  async me(userId: string): Promise<UserProfileWithRoles> {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    const roles: UserRole[] = []
    if (user.isAdmin) {
      roles.push('ADMIN')
    }
    if (user.isReferee) {
      roles.push('REFEREE')
    }

    const [coachTeams, playerTeams, refMatches] = await Promise.all([
      this.userTeamRepo.findByUserAndRole(userId, TeamRole.COACH),
      this.userTeamRepo.findByUserAndRole(userId, TeamRole.PLAYER),
      this.userMatchRepo.findByUser(userId),
    ])

    if (coachTeams.length > 0) {
      roles.push('COACH')
    }
    if (playerTeams.length > 0) {
      roles.push('PLAYER')
    }
    if (refMatches.length > 0 && !roles.includes('REFEREE')) {
      roles.push('REFEREE')
    }

    return { ...user, roles }
  }
}
