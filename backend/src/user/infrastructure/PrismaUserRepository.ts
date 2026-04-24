import { prisma } from '../../../utils/prismaClient.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'

const select = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isAdmin: true,
  avatar: true,
  createdAt: true,
} as const

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({ where: { id }, select })
  }

  async findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string }) | null> {
    const user = await prisma.user.findUnique({ where: { email }, select: { ...select, password: true } })
    return user ?? null
  }

  async findAll(): Promise<UserProfile[]> {
    return prisma.user.findMany({ select })
  }

  async create(input: CreateUserInput): Promise<UserProfile> {
    return prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        isAdmin: input.isAdmin ?? false,
        avatar: input.avatar,
      },
      select,
    })
  }

  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    return prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      },
      select,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }
}
