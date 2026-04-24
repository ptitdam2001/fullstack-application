import type { UserTeam, TeamRole } from '../domain/UserTeam.js'

export interface IUserTeamRepository {
  assign(userId: string, teamId: string, role: TeamRole): Promise<UserTeam>
  remove(userId: string, teamId: string, role: TeamRole): Promise<void>
  findByTeamAndRole(teamId: string, role: TeamRole): Promise<UserTeam[]>
  findByUserAndRole(userId: string, role: TeamRole): Promise<UserTeam[]>
  hasRole(userId: string, teamId: string, role: TeamRole): Promise<boolean>
}
