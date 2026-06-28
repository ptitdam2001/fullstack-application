import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { ITeamRepository, TeamPlayersOptions, TeamCalendarOptions, GameSummary } from '../ports/ITeamRepository.js'
import type {
  Team,
  CreateTeamInput,
  UpdateTeamInput,
  CreateTeamWithCoachInput,
  TeamCurrentGroup,
} from '../domain/Team.js'
import type { Player } from '../../player/domain/Player.js'
import type { UserTeam } from '../../userTeam/domain/UserTeam.js'

export class PrismaTeamRepository implements ITeamRepository {
  count() {
    return prisma.team.count({ where: { ...notDeleted } })
  }

  async findAll(): Promise<Team[]> {
    return prisma.team.findMany({
      where: { ...notDeleted },
      select: { id: true, name: true, color: true, updatedAt: true },
    })
  }

  async findById(id: string): Promise<Team | null> {
    return prisma.team.findFirst({
      where: { id, ...notDeleted },
      select: { id: true, name: true, color: true, updatedAt: true },
    })
  }

  async create(input: CreateTeamInput): Promise<Team> {
    return prisma.team.create({ data: input, select: { id: true, name: true, color: true, updatedAt: true } })
  }

  async update(id: string, input: UpdateTeamInput): Promise<Team> {
    return prisma.team.update({
      where: { id },
      data: input,
      select: { id: true, name: true, color: true, updatedAt: true },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.team.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async findPlayers(teamId: string, { page, count }: TeamPlayersOptions): Promise<Player[]> {
    return prisma.player.findMany({
      where: { teamId },
      skip: (page - 1) * count,
      take: count,
    })
  }

  async findCalendar(teamId: string, { page, count, startDate, endDate }: TeamCalendarOptions): Promise<GameSummary[]> {
    const matches = await prisma.match.findMany({
      where: {
        AND: [notDeleted],
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        ...(startDate || endDate
          ? { scheduledAt: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } }
          : {}),
      },
      skip: (page - 1) * count,
      take: count,
      orderBy: { scheduledAt: 'asc' },
      select: { id: true, scheduledAt: true, homeTeamId: true, awayTeamId: true, homeGoals: true, awayGoals: true },
    })
    return matches.map(m => ({
      id: m.id,
      date: m.scheduledAt,
      teams: [
        { teamId: m.homeTeamId, score: m.homeGoals ?? 0 },
        { teamId: m.awayTeamId, score: m.awayGoals ?? 0 },
      ],
    }))
  }

  async createWithCoach(
    input: CreateTeamWithCoachInput,
    coachUserId: string
  ): Promise<{ team: Team; userTeam: UserTeam }> {
    return prisma.$transaction(async tx => {
      const team = await tx.team.create({
        data: {
          name: input.name,
          color: input.color,
          ageCategoryId: input.ageCategoryId,
          areas: input.areas.map(a => ({
            id: crypto.randomUUID(),
            name: a.name,
            address: a.address,
            city: a.city,
            longitude: a.longitude,
            latitude: a.latitude,
          })),
        },
        select: { id: true, name: true, color: true, updatedAt: true },
      })

      const userTeam = await tx.userTeam.create({
        data: { userId: coachUserId, teamId: team.id, role: 'COACH' },
        select: { id: true, userId: true, teamId: true, role: true },
      })

      return { team: team as Team, userTeam: userTeam as UserTeam }
    })
  }

  async findCurrentGroup(teamId: string): Promise<TeamCurrentGroup | null> {
    const gt = await prisma.groupTeam.findFirst({
      where: { teamId },
      select: {
        group: { select: { id: true, name: true, phaseId: true, phase: { select: { championshipId: true } } } },
      },
    })
    if (!gt) {
      return null
    }
    return {
      groupId: gt.group.id,
      groupName: gt.group.name,
      phaseId: gt.group.phaseId,
      championshipId: gt.group.phase.championshipId,
    }
  }
}
