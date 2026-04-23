import { prisma } from '../../../utils/prismaClient.js'
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
} as const

export class PrismaChampionshipRepository implements IChampionshipRepository {
  count(): Promise<number> {
    return prisma.championship.count()
  }

  async findAll({ page, count }: PaginationOptions): Promise<Championship[]> {
    return prisma.championship.findMany({ skip: (page - 1) * count, take: count, select }) as Promise<Championship[]>
  }

  async findById(id: string): Promise<Championship | null> {
    return prisma.championship.findUnique({ where: { id }, select }) as Promise<Championship | null>
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
}
