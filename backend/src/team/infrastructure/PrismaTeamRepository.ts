import { prisma } from '../../../utils/prismaClient.js'
import type { ITeamRepository, TeamPlayersOptions, TeamCalendarOptions, GameSummary } from '../ports/ITeamRepository.js'
import type { Team, CreateTeamInput, UpdateTeamInput, CreateTeamWithCoachInput } from '../domain/Team.js'
import type { Player } from '../../player/domain/Player.js'
import type { UserTeam } from '../../userTeam/domain/UserTeam.js'

export class PrismaTeamRepository implements ITeamRepository {
  count() {
    return prisma.team.count()
  }

  async findAll(): Promise<Team[]> {
    return prisma.team.findMany({ select: { id: true, name: true, color: true } })
  }

  async findById(id: string): Promise<Team | null> {
    return prisma.team.findUnique({ where: { id }, select: { id: true, name: true, color: true } })
  }

  async create(input: CreateTeamInput): Promise<Team> {
    return prisma.team.create({ data: input, select: { id: true, name: true, color: true } })
  }

  async update(id: string, input: UpdateTeamInput): Promise<Team> {
    return prisma.team.update({ where: { id }, data: input, select: { id: true, name: true, color: true } })
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({ where: { id } })
  }

  async findPlayers(teamId: string, { page, count }: TeamPlayersOptions): Promise<Player[]> {
    return prisma.player.findMany({
      where: { teamId },
      skip: (page - 1) * count,
      take: count,
    })
  }

  async findCalendar(teamId: string, { page, count, startDate, endDate }: TeamCalendarOptions): Promise<GameSummary[]> {
    const games = await prisma.game.findMany({
      where: {
        gameTeams: { some: { teamId } },
        ...(startDate || endDate
          ? { date: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } }
          : {}),
      },
      skip: (page - 1) * count,
      take: count,
      orderBy: { date: 'asc' },
    })
    return games.map((g) => ({ id: g.id, date: g.date, teams: g.teams }))
  }

  async createWithCoach(input: CreateTeamWithCoachInput, coachUserId: string): Promise<{ team: Team; userTeam: UserTeam }> {
    return prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: input.name,
          color: input.color,
          ageCategory: input.ageCategory,
          areas: input.areas.map((a) => ({
            id: crypto.randomUUID(),
            name: a.name,
            address: a.address,
            city: a.city,
            longitude: a.longitude,
            latitude: a.latitude,
          })),
        },
        select: { id: true, name: true, color: true },
      })

      const userTeam = await tx.userTeam.create({
        data: { userId: coachUserId, teamId: team.id, role: 'COACH' },
        select: { id: true, userId: true, teamId: true, role: true },
      })

      return { team: team as Team, userTeam: userTeam as UserTeam }
    })
  }
}
