import { Prisma } from '@prisma/client'
import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { ISeasonRepository, PaginationOptions } from '../ports/ISeasonRepository.js'
import type { Season, CreateSeasonInput, UpdateSeasonInput } from '../domain/Season.js'
import { SeasonDuplicateLabelError } from '../domain/SeasonErrors.js'

const select = {
  id: true,
  label: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true,
} as const

export class PrismaSeasonRepository implements ISeasonRepository {
  count(): Promise<number> {
    return prisma.season.count({ where: { ...notDeleted } })
  }

  async findAll({ page, count }: PaginationOptions): Promise<Season[]> {
    return prisma.season.findMany({
      where: { ...notDeleted },
      skip: (page - 1) * count,
      take: count,
      select,
    }) as Promise<Season[]>
  }

  async findById(id: string): Promise<Season | null> {
    return prisma.season.findFirst({ where: { id, ...notDeleted }, select }) as Promise<Season | null>
  }

  async create(input: CreateSeasonInput): Promise<Season> {
    try {
      return (await prisma.season.create({ data: input, select })) as Season
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new SeasonDuplicateLabelError(input.label)
      }
      throw err
    }
  }

  async update(id: string, input: UpdateSeasonInput): Promise<Season> {
    try {
      return (await prisma.season.update({ where: { id }, data: input, select })) as Season
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new SeasonDuplicateLabelError(input.label ?? '')
      }
      throw err
    }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.season.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
