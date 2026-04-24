import { prisma } from '../../../utils/prismaClient.js'
import type { IPlayerRepository } from '../ports/IPlayerRepository.js'
import type { Player, CreatePlayerInput, UpdatePlayerInput } from '../domain/Player.js'

const select = { id: true, userId: true, teamId: true, jersey: true, position: true } as const

export class PrismaPlayerRepository implements IPlayerRepository {
  async findById(id: string): Promise<Player | null> {
    return prisma.player.findUnique({ where: { id }, select })
  }

  async findByUserAndTeam(userId: string, teamId: string): Promise<Player | null> {
    return prisma.player.findUnique({ where: { userId_teamId: { userId, teamId } }, select })
  }

  async findByUserId(userId: string): Promise<Player[]> {
    return prisma.player.findMany({ where: { userId }, select })
  }

  async create(input: CreatePlayerInput): Promise<Player> {
    return prisma.player.create({ data: input, select })
  }

  async update(id: string, input: UpdatePlayerInput): Promise<Player> {
    return prisma.player.update({ where: { id }, data: input, select })
  }

  async delete(id: string): Promise<void> {
    await prisma.player.delete({ where: { id } })
  }
}
