import type { IUserTeamRepository } from '../ports/IUserTeamRepository.js'
import type { UserTeam, TeamRole } from '../domain/UserTeam.js'
import { UserTeamNotFoundError, UserTeamAlreadyExistsError } from '../domain/UserTeamErrors.js'

export class UserTeamUseCases {
  constructor(private readonly repo: IUserTeamRepository) {}

  async assign(userId: string, teamId: string, role: TeamRole): Promise<UserTeam> {
    const already = await this.repo.hasRole(userId, teamId, role)
    if (already) throw new UserTeamAlreadyExistsError(userId, teamId, role)
    return this.repo.assign(userId, teamId, role)
  }

  async remove(userId: string, teamId: string, role: TeamRole): Promise<void> {
    const exists = await this.repo.hasRole(userId, teamId, role)
    if (!exists) throw new UserTeamNotFoundError(userId, teamId, role)
    return this.repo.remove(userId, teamId, role)
  }

  getTeamMembers(teamId: string, role: TeamRole): Promise<UserTeam[]> {
    return this.repo.findByTeamAndRole(teamId, role)
  }

  getUserTeams(userId: string, role: TeamRole): Promise<UserTeam[]> {
    return this.repo.findByUserAndRole(userId, role)
  }

  hasRole(userId: string, teamId: string, role: TeamRole): Promise<boolean> {
    return this.repo.hasRole(userId, teamId, role)
  }
}
