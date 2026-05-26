import { prisma } from '../../../utils/prismaClient.js'
import type { IMatchRepository, PaginationOptions, MatchFilterOptions } from '../ports/IMatchRepository.js'
import type { Match, CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'

const select = {
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
  updatedAt: true,
} as const

export class PrismaMatchRepository implements IMatchRepository {
  count(): Promise<number> {
    return prisma.match.count({ where: { deletedAt: null } })
  }

  async findAll({ page, count }: PaginationOptions, filters?: MatchFilterOptions): Promise<Match[]> {
    const where = {
      deletedAt: null,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.pastDue ? { scheduledAt: { lt: new Date() }, status: 'SCHEDULED' as const } : {}),
    }
    return prisma.match.findMany({ where, skip: (page - 1) * count, take: count, select }) as Promise<Match[]>
  }

  async findById(id: string): Promise<Match | null> {
    return prisma.match.findFirst({ where: { id, deletedAt: null }, select }) as Promise<Match | null>
  }

  async findByGroupId(groupId: string): Promise<Match[]> {
    return prisma.match.findMany({ where: { groupId, deletedAt: null }, select }) as Promise<Match[]>
  }

  async create(input: CreateMatchInput): Promise<Match> {
    return prisma.match.create({ data: input, select }) as Promise<Match>
  }

  async update(id: string, input: UpdateMatchInput): Promise<Match> {
    return prisma.match.update({ where: { id }, data: input, select }) as Promise<Match>
  }

  async delete(id: string): Promise<void> {
    await prisma.match.delete({ where: { id } })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.match.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
