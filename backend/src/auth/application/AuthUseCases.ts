import type { IUserRepository } from '../../user/ports/IUserRepository.js'
import type { IAuthService } from '../ports/IAuthService.js'
import type { UserProfile } from '../../user/domain/User.js'
import type { LoginResult } from '../domain/User.js'
import type { IUserTeamRepository } from '../../userTeam/ports/IUserTeamRepository.js'
import type { IUserMatchRepository } from '../../userMatch/ports/IUserMatchRepository.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { InvalidCredentialsError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'

export type UserProfileWithRoles = UserProfile & { roles: string[] }

export class AuthUseCases {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService,
    private readonly userTeamRepo: IUserTeamRepository,
    private readonly userMatchRepo: IUserMatchRepository
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmailWithPassword(email)
    if (!user) {
      throw new UserNotFoundError()
    }

    const isMatch = await this.authService.comparePassword(password, user.password)
    if (!isMatch) {
      throw new InvalidCredentialsError()
    }

    const token = this.authService.generateToken(user.id, user.isAdmin)
    return { userId: user.id, email: user.email, isAdmin: user.isAdmin, token }
  }

  async me(userId: string): Promise<UserProfileWithRoles> {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    const roles: string[] = []
    if (user.isAdmin) {
      roles.push('ADMIN')
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
    if (refMatches.length > 0) {
      roles.push('REFEREE')
    }

    return { ...user, roles }
  }
}
