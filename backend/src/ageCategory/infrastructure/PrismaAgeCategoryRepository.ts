import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { IAgeCategoryRepository, PaginationOptions } from '../ports/IAgeCategoryRepository.js'
import type { AgeCategory, CreateAgeCategoryInput, UpdateAgeCategoryInput } from '../domain/AgeCategory.js'

const select = {
  id: true,
  label: true,
  genre: true,
  createdAt: true,
  updatedAt: true,
} as const

export class PrismaAgeCategoryRepository implements IAgeCategoryRepository {
  count(): Promise<number> {
    return prisma.ageCategory.count({ where: { ...notDeleted } })
  }

  async findAll({ page, count }: PaginationOptions): Promise<AgeCategory[]> {
    return prisma.ageCategory.findMany({
      where: { ...notDeleted },
      skip: (page - 1) * count,
      take: count,
      select,
    }) as Promise<AgeCategory[]>
  }

  async findById(id: string): Promise<AgeCategory | null> {
    return prisma.ageCategory.findFirst({ where: { id, ...notDeleted }, select }) as Promise<AgeCategory | null>
  }

  async create(input: CreateAgeCategoryInput): Promise<AgeCategory> {
    return prisma.ageCategory.create({ data: input, select }) as Promise<AgeCategory>
  }

  async update(id: string, input: UpdateAgeCategoryInput): Promise<AgeCategory> {
    return prisma.ageCategory.update({ where: { id }, data: input, select }) as Promise<AgeCategory>
  }

  async delete(id: string): Promise<void> {
    await prisma.ageCategory.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
