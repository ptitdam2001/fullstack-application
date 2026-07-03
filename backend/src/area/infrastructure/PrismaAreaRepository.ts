import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { IAreaRepository, PaginationOptions } from '../ports/IAreaRepository.js'
import type { Area, CreateAreaInput, UpdateAreaInput } from '../domain/Area.js'

const select = {
  id: true,
  name: true,
  address: true,
  city: true,
  longitude: true,
  latitude: true,
  updatedAt: true,
} as const

export class PrismaAreaRepository implements IAreaRepository {
  count(): Promise<number> {
    return prisma.area.count({ where: { ...notDeleted } })
  }

  async findAll({ page, limit }: PaginationOptions): Promise<Area[]> {
    return prisma.area.findMany({
      where: { ...notDeleted },
      skip: page * limit,
      take: limit,
      select,
    }) as Promise<Area[]>
  }

  async findById(id: string): Promise<Area | null> {
    return prisma.area.findFirst({ where: { id, ...notDeleted }, select }) as Promise<Area | null>
  }

  async create(input: CreateAreaInput): Promise<Area> {
    return prisma.area.create({ data: input, select }) as Promise<Area>
  }

  async update(id: string, input: UpdateAreaInput): Promise<Area> {
    return prisma.area.update({ where: { id }, data: input, select }) as Promise<Area>
  }

  async delete(id: string): Promise<void> {
    await prisma.area.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
