import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { Phase, CreatePhaseInput, UpdatePhaseInput } from '../domain/Phase.js'

const select = { id: true, championshipId: true, type: true, order: true, name: true, updatedAt: true } as const

export class PrismaPhaseRepository implements IPhaseRepository {
  async findByChampionshipId(championshipId: string): Promise<Phase[]> {
    return prisma.phase.findMany({ where: { championshipId, ...notDeleted }, orderBy: { order: 'asc' }, select }) as Promise<Phase[]>
  }

  async findById(id: string): Promise<Phase | null> {
    return prisma.phase.findFirst({ where: { id, ...notDeleted }, select }) as Promise<Phase | null>
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

  async softDelete(id: string): Promise<void> {
    await prisma.phase.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async hasPlayedMatches(id: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { ...notDeleted, status: { in: ['PLAYED', 'FORFEITED'] }, group: { phaseId: id } },
    })
    return count > 0
  }
}