import { prisma } from '../../../utils/prismaClient.js'
import type { IPlayerRepository } from '../ports/IPlayerRepository.js'
import type { Player, CreatePlayerInput, UpdatePlayerInput } from '../domain/Player.js'

export class PrismaPlayerRepository implements IPlayerRepository {
  async findById(id: string): Promise<Player | null> {
    return prisma.player.findUnique({ where: { id } })
  }

  async findByUserId(userId: string): Promise<Player | null> {
    return prisma.player.findUnique({ where: { userId } })
  }

  async create(input: CreatePlayerInput): Promise<Player> {
    return prisma.player.create({ data: input })
  }

  async update(id: string, input: UpdatePlayerInput): Promise<Player> {
    return prisma.player.update({ where: { id }, data: input })
  }

  async assignToTeam(userId: string, teamId: string): Promise<void> {
    await prisma.player.update({ where: { userId }, data: { teamId } })
  }
}
