import { prisma } from '../../../utils/prismaClient.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import type { UserProfile, CreateUserInput, UpdateUserInput } from '../domain/User.js'
import { Role } from '../domain/User.js'

function mapUser(user: {
  id: string
  firstName: string
  lastName: string | null
  email: string
  role: string
  avatar: string | null
  createdAt: Date
}): UserProfile {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role as Role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }
}

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({ where: { id }, omit: { password: true } })
    return user ? mapUser(user) : null
  }

  async findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string }) | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    return { ...mapUser(user), password: user.password }
  }

  async findAll(): Promise<UserProfile[]> {
    const users = await prisma.user.findMany({ omit: { password: true } })
    return users.map(mapUser)
  }

  async create(input: CreateUserInput): Promise<UserProfile> {
    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        role: input.role ?? 'COACH',
        avatar: input.avatar,
      },
      omit: { password: true },
    })
    return mapUser(user)
  }

  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.role !== undefined && { role: input.role }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      },
      omit: { password: true },
    })
    return mapUser(user)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }
}
