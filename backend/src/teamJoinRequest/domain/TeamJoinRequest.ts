import type { TeamRole } from '../../userTeam/domain/UserTeam.js'

export enum JoinRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REFUSED = 'REFUSED',
}

export type TeamJoinRequest = {
  id: string
  userId: string
  teamId: string
  requestedRole: TeamRole
  status: JoinRequestStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateJoinRequestInput = {
  userId: string
  teamId: string
  requestedRole: TeamRole
}
