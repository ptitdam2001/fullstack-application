import { prisma } from '../../../utils/prismaClient.js'
import type { IStandingsRepository, GroupContext } from '../ports/IStandingsRepository.js'
import type { Match } from '../../match/domain/Match.js'

const matchSelect = {
  id: true,
  groupId: true,
  status: true,
  scheduledAt: true,
  area: true,
  homeTeamId: true,
  awayTeamId: true,
  homeGoals: true,
  awayGoals: true,
  forfeitedBy: true,
} as const

export class PrismaStandingsRepository implements IStandingsRepository {
  async findMatchesByGroupId(groupId: string): Promise<Match[]> {
    return prisma.match.findMany({ where: { groupId }, select: matchSelect }) as Promise<Match[]>
  }

  async findGroupContext(groupId: string): Promise<GroupContext> {
    const [groupTeams, group] = await Promise.all([
      prisma.groupTeam.findMany({ where: { groupId }, select: { teamId: true } }),
      prisma.group.findUniqueOrThrow({
        where: { id: groupId },
        include: { phase: { include: { championship: { select: { pointsConfig: true } } } } },
      }),
    ])

    return {
      teamIds: groupTeams.map((gt) => gt.teamId),
      pointsConfig: group.phase.championship.pointsConfig,
    }
  }
}
