import { prisma } from '../../../utils/prismaClient.js'
import type { IUserMatchRepository } from '../ports/IUserMatchRepository.js'
import type { UserMatch } from '../domain/UserMatch.js'

const select = { id: true, userId: true, matchId: true } as const

export class PrismaUserMatchRepository implements IUserMatchRepository {
  async assign(userId: string, matchId: string): Promise<UserMatch> {
    return prisma.userMatch.create({ data: { userId, matchId }, select })
  }

  async remove(userId: string, matchId: string): Promise<void> {
    await prisma.userMatch.deleteMany({ where: { userId, matchId } })
  }

  async findByMatch(matchId: string): Promise<UserMatch[]> {
    return prisma.userMatch.findMany({ where: { matchId }, select })
  }

  async findByUser(userId: string): Promise<UserMatch[]> {
    return prisma.userMatch.findMany({ where: { userId }, select })
  }

  async isReferee(userId: string, matchId: string): Promise<boolean> {
    const count = await prisma.userMatch.count({ where: { userId, matchId } })
    return count > 0
  }
}
