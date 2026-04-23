import { prisma } from '../../../utils/prismaClient.js'
import type { IMatchRepository, PaginationOptions } from '../ports/IMatchRepository.js'
import type { Match, CreateMatchInput, UpdateMatchInput } from '../domain/Match.js'

const select = { id: true, date: true, area: true, teams: true } as const

export class PrismaMatchRepository implements IMatchRepository {
  count(): Promise<number> {
    return prisma.match.count()
  }

  async findAll({ page, count }: PaginationOptions): Promise<Match[]> {
    return prisma.match.findMany({ skip: (page - 1) * count, take: count, select }) as Promise<Match[]>
  }

  async findById(id: string): Promise<Match | null> {
    return prisma.match.findUnique({ where: { id }, select }) as Promise<Match | null>
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
}
