import { prisma } from '../../../utils/prismaClient.js'
import type { ITeamJoinRequestRepository } from '../ports/ITeamJoinRequestRepository.js'
import type { TeamJoinRequest, JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'

const select = {
  id: true,
  userId: true,
  teamId: true,
  requestedRole: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const

export class PrismaTeamJoinRequestRepository implements ITeamJoinRequestRepository {
  async findById(id: string): Promise<TeamJoinRequest | null> {
    return prisma.teamJoinRequest.findUnique({ where: { id }, select })
  }

  async findByUserAndTeam(userId: string, teamId: string): Promise<TeamJoinRequest | null> {
    return prisma.teamJoinRequest.findUnique({ where: { userId_teamId: { userId, teamId } }, select })
  }

  async findByTeam(teamId: string, status?: JoinRequestStatus): Promise<TeamJoinRequest[]> {
    return prisma.teamJoinRequest.findMany({
      where: { teamId, ...(status ? { status } : {}) },
      select,
    })
  }

  async upsert(userId: string, teamId: string, requestedRole: TeamRole): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.upsert({
      where: { userId_teamId: { userId, teamId } },
      create: { userId, teamId, requestedRole, status: 'PENDING' },
      update: { requestedRole, status: 'PENDING', updatedAt: new Date() },
      select,
    })
  }

  async approve(requestId: string, userId: string, teamId: string, requestedRole: TeamRole): Promise<TeamJoinRequest> {
    const [updated] = await prisma.$transaction([
      prisma.teamJoinRequest.update({ where: { id: requestId }, data: { status: 'APPROVED' }, select }),
      prisma.userTeam.create({ data: { userId, teamId, role: requestedRole } }),
      ...(requestedRole === TeamRole.PLAYER ? [prisma.player.create({ data: { userId, teamId } })] : []),
    ])
    return updated as TeamJoinRequest
  }

  async refuse(requestId: string): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: { status: 'REFUSED' },
      select,
    })
  }
}