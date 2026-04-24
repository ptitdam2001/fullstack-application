import { prisma } from '../../../utils/prismaClient.js'
import type { IGroupRepository } from '../ports/IGroupRepository.js'
import type { Group, CreateGroupInput, UpdateGroupInput } from '../domain/Group.js'

const select = { id: true, phaseId: true, name: true, matchMode: true, teamIds: true } as const

export class PrismaGroupRepository implements IGroupRepository {
  async findByPhaseId(phaseId: string): Promise<Group[]> {
    return prisma.group.findMany({ where: { phaseId }, select }) as Promise<Group[]>
  }

  async findById(id: string): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id }, select }) as Promise<Group | null>
  }

  async create(input: CreateGroupInput): Promise<Group> {
    return prisma.group.create({ data: input, select }) as Promise<Group>
  }

  async update(id: string, input: UpdateGroupInput): Promise<Group> {
    return prisma.group.update({ where: { id }, data: input, select }) as Promise<Group>
  }

  async delete(id: string): Promise<void> {
    await prisma.group.delete({ where: { id } })
  }
}
