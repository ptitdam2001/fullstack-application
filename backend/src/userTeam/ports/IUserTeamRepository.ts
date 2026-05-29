import type { UserTeam, UserTeamWithTeam, TeamRole } from '../domain/UserTeam.js'

export interface IUserTeamRepository {
  assign(userId: string, teamId: string, role: TeamRole): Promise<UserTeam>
  remove(userId: string, teamId: string, role: TeamRole): Promise<void>
  findByTeamAndRole(teamId: string, role: TeamRole): Promise<UserTeam[]>
  findByUserAndRole(userId: string, role: TeamRole): Promise<UserTeam[]>
  findByUser(userId: string): Promise<UserTeamWithTeam[]>
  hasRole(userId: string, teamId: string, role: TeamRole): Promise<boolean>
}
