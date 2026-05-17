import type { TeamJoinRequest, JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import type { TeamRole } from '../../userTeam/domain/UserTeam.js'

export interface ITeamJoinRequestRepository {
  findById(id: string): Promise<TeamJoinRequest | null>
  findByUserAndTeam(userId: string, teamId: string): Promise<TeamJoinRequest | null>
  findByTeam(teamId: string, status?: JoinRequestStatus): Promise<TeamJoinRequest[]>
  upsert(userId: string, teamId: string, requestedRole: TeamRole): Promise<TeamJoinRequest>
  approve(requestId: string, userId: string, teamId: string, requestedRole: TeamRole): Promise<TeamJoinRequest>
  refuse(requestId: string): Promise<TeamJoinRequest>
}
