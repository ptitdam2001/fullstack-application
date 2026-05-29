import { prisma } from '../../../utils/prismaClient.js'
import type { IUserTeamRepository } from '../ports/IUserTeamRepository.js'
import type { UserTeam, UserTeamWithTeam, TeamRole } from '../domain/UserTeam.js'

const select = { id: true, userId: true, teamId: true, role: true } as const

const selectWithTeam = {
  id: true,
  userId: true,
  teamId: true,
  role: true,
  team: { select: { id: true, name: true, color: true } },
} as const

export class PrismaUserTeamRepository implements IUserTeamRepository {
  async assign(userId: string, teamId: string, role: TeamRole): Promise<UserTeam> {
    return prisma.userTeam.create({ data: { userId, teamId, role }, select }) as Promise<UserTeam>
  }

  async remove(userId: string, teamId: string, role: TeamRole): Promise<void> {
    await prisma.userTeam.deleteMany({ where: { userId, teamId, role } })
  }

  async findByTeamAndRole(teamId: string, role: TeamRole): Promise<UserTeam[]> {
    return prisma.userTeam.findMany({ where: { teamId, role }, select }) as Promise<UserTeam[]>
  }

  async findByUserAndRole(userId: string, role: TeamRole): Promise<UserTeam[]> {
    return prisma.userTeam.findMany({ where: { userId, role }, select }) as Promise<UserTeam[]>
  }

  async findByUser(userId: string): Promise<UserTeamWithTeam[]> {
    return prisma.userTeam.findMany({ where: { userId }, select: selectWithTeam }) as Promise<UserTeamWithTeam[]>
  }

  async hasRole(userId: string, teamId: string, role: TeamRole): Promise<boolean> {
    const count = await prisma.userTeam.count({ where: { userId, teamId, role } })
    return count > 0
  }
}
