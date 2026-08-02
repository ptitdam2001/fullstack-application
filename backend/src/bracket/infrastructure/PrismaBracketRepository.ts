import { prisma } from '../../../utils/prismaClient.js'
import { notDeleted } from '../../../utils/softDelete.js'
import type { IBracketRepository } from '../ports/IBracketRepository.js'
import type { Bracket, CreateBracketInput } from '../domain/Bracket.js'

const select = {
  id: true,
  phaseId: true,
  name: true,
  updatedAt: true,
  bracketTeams: { select: { teamId: true, round: true, seed: true } },
} as const

type RawBracket = {
  id: string
  phaseId: string
  name: string
  updatedAt: Date
  bracketTeams: { teamId: string; round: number; seed: number }[]
}

function toBracket(raw: RawBracket): Bracket {
  return { id: raw.id, phaseId: raw.phaseId, name: raw.name, updatedAt: raw.updatedAt, bracketTeams: raw.bracketTeams }
}

export class PrismaBracketRepository implements IBracketRepository {
  async findById(id: string): Promise<Bracket | null> {
    const row = await prisma.bracket.findFirst({ where: { id, ...notDeleted }, select })
    return row ? toBracket(row) : null
  }

  async create(input: CreateBracketInput): Promise<Bracket> {
    const { bracketTeams, ...rest } = input
    const row = await prisma.bracket.create({
      data: { ...rest, bracketTeams: { create: bracketTeams.map((bt) => ({ teamId: bt.teamId, round: bt.round, seed: bt.seed })) } },
      select,
    })
    return toBracket(row)
  }

  async hasPlayedMatches(id: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { bracketId: id, ...notDeleted, status: { in: ['PLAYED', 'FORFEITED'] } },
    })
    return count > 0
  }
}
