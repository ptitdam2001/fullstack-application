import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { IChampionshipRepository, PaginationOptions } from '../ports/IChampionshipRepository.js'
import type { Championship, CreateChampionshipInput, UpdateChampionshipInput } from '../domain/Championship.js'

const select = {
  id: true,
  name: true,
  ageCategory: true,
  season: true,
  startDate: true,
  endDate: true,
  pointsConfig: true,
  createdAt: true,
  updatedAt: true,
} as const

export class PrismaChampionshipRepository implements IChampionshipRepository {
  count(): Promise<number> {
    return prisma.championship.count({ where: { ...notDeleted } })
  }

  async findAll({ page, count }: PaginationOptions): Promise<Championship[]> {
    return prisma.championship.findMany({ where: { ...notDeleted }, skip: (page - 1) * count, take: count, select }) as Promise<Championship[]>
  }

  async findById(id: string): Promise<Championship | null> {
    return prisma.championship.findFirst({ where: { id, ...notDeleted }, select }) as Promise<Championship | null>
  }

  async create(input: CreateChampionshipInput): Promise<Championship> {
    return prisma.championship.create({ data: input, select }) as Promise<Championship>
  }

  async update(id: string, input: UpdateChampionshipInput): Promise<Championship> {
    return prisma.championship.update({ where: { id }, data: input, select }) as Promise<Championship>
  }

  async delete(id: string): Promise<void> {
    await prisma.championship.delete({ where: { id } })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.championship.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async hasPlayedMatches(id: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { ...notDeleted, status: { in: ['PLAYED', 'FORFEITED'] }, group: { phase: { championshipId: id } } },
    })
    return count > 0
  }
}