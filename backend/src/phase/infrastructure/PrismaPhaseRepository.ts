import { prisma } from '../../../utils/prismaClient.js'
import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { Phase, CreatePhaseInput, UpdatePhaseInput } from '../domain/Phase.js'

const select = { id: true, championshipId: true, type: true, order: true, name: true } as const

export class PrismaPhaseRepository implements IPhaseRepository {
  async findByChampionshipId(championshipId: string): Promise<Phase[]> {
    return prisma.phase.findMany({ where: { championshipId }, orderBy: { order: 'asc' }, select }) as Promise<Phase[]>
  }

  async findById(id: string): Promise<Phase | null> {
    return prisma.phase.findUnique({ where: { id }, select }) as Promise<Phase | null>
  }

  async create(input: CreatePhaseInput): Promise<Phase> {
    return prisma.phase.create({ data: input, select }) as Promise<Phase>
  }

  async update(id: string, input: UpdatePhaseInput): Promise<Phase> {
    return prisma.phase.update({ where: { id }, data: input, select }) as Promise<Phase>
  }

  async delete(id: string): Promise<void> {
    await prisma.phase.delete({ where: { id } })
  }
}
