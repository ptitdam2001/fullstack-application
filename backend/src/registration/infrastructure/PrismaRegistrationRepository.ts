import { prisma } from '../../../utils/prismaClient.js'
import type { IRegistrationRepository } from '../ports/IRegistrationRepository.js'
import type { RegistrationUser, CreateRegistrationInput } from '../domain/Registration.js'

const select = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  isAdmin: true,
  isActive: true,
  isBlocked: true,
  isReferee: true,
  avatar: true,
  createdAt: true,
  activationTokenExpiry: true,
  resetTokenExpiry: true,
} as const

export class PrismaRegistrationRepository implements IRegistrationRepository {
  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    return user !== null
  }

  async findById(userId: string): Promise<RegistrationUser | null> {
    return prisma.user.findUnique({ where: { id: userId }, select })
  }

  async findByEmail(email: string): Promise<RegistrationUser | null> {
    return prisma.user.findUnique({ where: { email }, select })
  }

  async findByActivationToken(token: string): Promise<RegistrationUser | null> {
    return prisma.user.findFirst({ where: { activationToken: token }, select })
  }

  async findByResetToken(token: string): Promise<RegistrationUser | null> {
    return prisma.user.findFirst({ where: { resetToken: token }, select })
  }

  async create(input: CreateRegistrationInput, activationToken: string, activationTokenExpiry: Date): Promise<RegistrationUser> {
    return prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        isActive: false,
        activationToken,
        activationTokenExpiry,
      },
      select,
    })
  }

  async createWithJoinRequest(
    input: CreateRegistrationInput,
    activationToken: string,
    activationTokenExpiry: Date,
    teamId: string
  ): Promise<RegistrationUser> {
    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        isActive: false,
        activationToken,
        activationTokenExpiry,
      },
      select,
    })

    await prisma.teamJoinRequest.upsert({
      where: { userId_teamId: { userId: user.id, teamId } },
      create: { userId: user.id, teamId, status: 'PENDING' },
      update: { status: 'PENDING', updatedAt: new Date() },
    })

    return user
  }

  async activateAccount(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true, activationToken: null, activationTokenExpiry: null },
    })
  }

  async setActivationToken(userId: string, token: string, expiry: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { activationToken: token, activationTokenExpiry: expiry },
    })
  }

  async setResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })
  }

  async resetPassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        loginAttempts: 0,
        isBlocked: false,
      },
    })
  }

  async declareReferee(userId: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { isReferee: true } })
  }

  async adminActivateUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true, activationToken: null, activationTokenExpiry: null },
    })
  }

  async adminUnblockUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: false, loginAttempts: 0 },
    })
  }
}