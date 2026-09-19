import { prisma } from '../../../utils/prismaClient.js'
import type { IUserRepository } from '../ports/IUserRepository.js'
import type { UserProfile, UserRole, CreateUserInput, UpdateUserInput } from '../domain/User.js'

const select = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isAdmin: true,
  isActive: true,
  isBlocked: true,
  isReferee: true,
  loginAttempts: true,
  lockedUntil: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
} as const

type RawUser = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  isAdmin: boolean
  isActive: boolean
  isBlocked: boolean
  isReferee: boolean
  loginAttempts: number
  lockedUntil: Date | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

function toUserProfile({ lockedUntil, ...raw }: RawUser): UserProfile {
  const roles: UserRole[] = []
  if (raw.isAdmin) {
    roles.push('ADMIN')
  }
  if (raw.isReferee) {
    roles.push('REFEREE')
  }
  // A temporary login lock surfaces as isBlocked so the API keeps a single flag (spec 10)
  const isLocked = lockedUntil !== null && lockedUntil > new Date()
  return { ...raw, isBlocked: raw.isBlocked || isLocked, roles }
}

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const row = await prisma.user.findUnique({ where: { id }, select })
    return row ? toUserProfile(row) : null
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<(UserProfile & { password: string; lockedUntil: Date | null }) | null> {
    const row = await prisma.user.findUnique({ where: { email }, select: { ...select, password: true } })
    if (!row) {
      return null
    }
    return { ...toUserProfile(row), password: row.password, lockedUntil: row.lockedUntil }
  }

  async findAll(): Promise<UserProfile[]> {
    const rows = await prisma.user.findMany({ select })
    return rows.map(toUserProfile)
  }

  async create(input: CreateUserInput): Promise<UserProfile> {
    const row = await prisma.user.create({
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
    return toUserProfile(row)
  }

  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const row = await prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      },
      select,
    })
    return toUserProfile(row)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }

  async incrementLoginAttempts(userId: string): Promise<number> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: { increment: 1 } },
      select: { loginAttempts: true },
    })
    return updated.loginAttempts
  }

  async lockUntil(userId: string, until: Date): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { lockedUntil: until } })
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { loginAttempts: 0, lockedUntil: null } })
  }
}
