import { prisma } from '../../../utils/prismaClient.js'
import type { IGroupRepository } from '../ports/IGroupRepository.js'
import type { Group, CreateGroupInput, UpdateGroupInput } from '../domain/Group.js'

const select = {
  id: true,
  phaseId: true,
  name: true,
  matchMode: true,
  updatedAt: true,
  groupTeams: { select: { teamId: true } },
} as const

type RawGroup = { id: string; phaseId: string; name: string; matchMode: string; updatedAt: Date; groupTeams: { teamId: string }[] }

function toGroup(raw: RawGroup): Group {
  return { ...raw, matchMode: raw.matchMode as Group['matchMode'], teamIds: raw.groupTeams.map((gt) => gt.teamId) }
}

export class PrismaGroupRepository implements IGroupRepository {
  async findByPhaseId(phaseId: string): Promise<Group[]> {
    const rows = await prisma.group.findMany({ where: { phaseId, deletedAt: null }, select })
    return rows.map(toGroup)
  }

  async findById(id: string): Promise<Group | null> {
    const row = await prisma.group.findFirst({ where: { id, deletedAt: null }, select })
    return row ? toGroup(row) : null
  }

  async create(input: CreateGroupInput): Promise<Group> {
    const { teamIds, ...rest } = input
    const row = await prisma.group.create({
      data: { ...rest, groupTeams: { create: teamIds.map((teamId) => ({ teamId })) } },
      select,
    })
    return toGroup(row)
  }

  async update(id: string, input: UpdateGroupInput): Promise<Group> {
    const { teamIds, ...rest } = input
    const row = await prisma.group.update({
      where: { id },
      data: {
        ...rest,
        ...(teamIds !== undefined && {
          groupTeams: { deleteMany: {}, create: teamIds.map((teamId) => ({ teamId })) },
        }),
      },
      select,
    })
    return toGroup(row)
  }

  async delete(id: string): Promise<void> {
    await prisma.group.delete({ where: { id } })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.group.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async hasPlayedMatches(id: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { groupId: id, deletedAt: null, status: { in: ['PLAYED', 'FORFEITED'] } },
    })
    return count > 0
  }
}
