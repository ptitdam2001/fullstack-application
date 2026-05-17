import type { ITeamJoinRequestRepository } from '../ports/ITeamJoinRequestRepository.js'
import type { TeamJoinRequest, JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import type { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { AlreadyMemberError, JoinRequestNotFoundError, JoinRequestNotPendingError } from '../domain/TeamJoinRequestErrors.js'

export class TeamJoinRequestUseCases {
  constructor(private readonly repo: ITeamJoinRequestRepository) {}

  async createRequest(userId: string, teamId: string, requestedRole: TeamRole): Promise<TeamJoinRequest> {
    const existing = await this.repo.findByUserAndTeam(userId, teamId)
    if (existing?.status === 'APPROVED') {
      throw new AlreadyMemberError()
    }
    return this.repo.upsert(userId, teamId, requestedRole)
  }

  async getTeamRequests(teamId: string, status?: JoinRequestStatus): Promise<TeamJoinRequest[]> {
    return this.repo.findByTeam(teamId, status)
  }

  async updateRequest(
    requestId: string,
    teamId: string,
    action: 'approve' | 'refuse',
    approverId: string
  ): Promise<TeamJoinRequest> {
    const request = await this.repo.findById(requestId)
    if (!request || request.teamId !== teamId) {
      throw new JoinRequestNotFoundError()
    }
    if (request.status !== 'PENDING') {
      throw new JoinRequestNotPendingError()
    }

    if (action === 'refuse') {
      return this.repo.refuse(requestId)
    }
    return this.repo.approve(requestId, request.userId, teamId, request.requestedRole)
  }
}
