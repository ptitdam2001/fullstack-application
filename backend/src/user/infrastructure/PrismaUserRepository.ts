import { prisma } from '../../../utils/prismaClient.js'
import type {
  AvatarReplacement,
  IUserRepository,
  UserFilterOptions,
  UserListOptions,
} from '../ports/IUserRepository.js'
import type { AuthState, UserProfile, UserRole, UpdateUserInput } from '../domain/User.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'

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
  // Contextual roles live in relation tables (spec 06), not on User
  userTeams: { select: { role: true } },
  userMatches: { select: { id: true }, take: 1 },
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
  userTeams: { role: `${TeamRole}` }[]
  userMatches: { id: string }[]
}

const isLockActive = (lockedUntil: Date | null): boolean => lockedUntil !== null && lockedUntil > new Date()

/**
 * Resolves the roles exposed on the API from the global flags and the relation tables (spec 06):
 * ADMIN ← isAdmin, COACH/PLAYER ← userTeams, REFEREE ← isReferee or at least one userMatch.
 * Each role appears at most once.
 */
function deriveRoles({ isAdmin, isReferee, userTeams, userMatches }: RawUser): UserRole[] {
  const allRoles = new Set<UserRole>()

  if (isAdmin) {
    allRoles.add('ADMIN')
  }
  userTeams.forEach(({ role }) => allRoles.add(role))

  if (isReferee || userMatches.length > 0) {
    allRoles.add('REFEREE')
  }
  return Array.from(allRoles)
}

function toUserProfile(raw: RawUser): UserProfile {
  const { lockedUntil, userTeams: _userTeams, userMatches: _userMatches, ...profile } = raw
  // A temporary login lock surfaces as isBlocked so the API keeps a single flag (spec 10)
  return { ...profile, isBlocked: profile.isBlocked || isLockActive(lockedUntil), roles: deriveRoles(raw) }
}

const toWhere = (filters?: UserFilterOptions) => ({
  ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
})

// A user created without an avatar has no `avatar` field at all, which `{ avatar: null }` alone does not match.
const avatarIs = (avatar: string | null) =>
  avatar === null ? { OR: [{ avatar: null }, { avatar: { isSet: false } }] } : { avatar }

// A failed attempt of `replaceAvatar` means another change of the same avatar went through in between, so
// this is only reached by more simultaneous changes of one user's avatar than any real client produces.
const MAX_AVATAR_REPLACE_ATTEMPTS = 10

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

  async findByIdWithPassword(id: string): Promise<(UserProfile & { password: string }) | null> {
    const row = await prisma.user.findUnique({ where: { id }, select: { ...select, password: true } })
    if (!row) {
      return null
    }
    return { ...toUserProfile(row), password: row.password }
  }

  async findAll(options?: UserListOptions): Promise<UserProfile[]> {
    const pagination = options?.pagination
    const rows = await prisma.user.findMany({
      where: toWhere(options),
      // Stable order so pages don't overlap or skip users between requests
      orderBy: { createdAt: 'asc' },
      ...(pagination && { skip: pagination.page * pagination.limit, take: pagination.limit }),
      select,
    })
    return rows.map(toUserProfile)
  }

  count(filters?: UserFilterOptions): Promise<number> {
    return prisma.user.count({ where: toWhere(filters) })
  }

  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const row = await prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.isAdmin !== undefined && { isAdmin: input.isAdmin }),
      },
      select,
    })
    return toUserProfile(row)
  }

  async replaceAvatar(id: string, avatar: string | null): Promise<AvatarReplacement | null> {
    // Compare-and-swap: the write only goes through while the avatar is still the one just read, so
    // `previousAvatar` is exactly the value this call replaced. With a plain read then a plain update, two
    // concurrent calls would both report the same previous value, and nobody the value of the other.
    for (let attempt = 0; attempt < MAX_AVATAR_REPLACE_ATTEMPTS; attempt++) {
      const current = await prisma.user.findUnique({ where: { id }, select: { avatar: true } })
      if (!current) {
        return null
      }
      const { count } = await prisma.user.updateMany({
        where: { id, ...avatarIs(current.avatar) },
        data: { avatar },
      })
      if (count === 1) {
        const user = await this.findById(id)
        return user && { user, previousAvatar: current.avatar }
      }
    }
    throw new Error(`Avatar of user ${id} not replaced: too many concurrent changes`)
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

  async findAuthState(userId: string): Promise<AuthState | null> {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isAdmin: true,
        isActive: true,
        isBlocked: true,
        lockedUntil: true,
        tokensValidAfter: true,
        userTeams: { where: { role: TeamRole.COACH }, select: { id: true }, take: 1 },
      },
    })
    if (!row) {
      return null
    }
    return {
      isAdmin: row.isAdmin,
      isActive: row.isActive,
      isBlocked: row.isBlocked || isLockActive(row.lockedUntil),
      isCoach: row.userTeams.length > 0,
      tokensValidAfter: row.tokensValidAfter,
    }
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { loginAttempts: 0, lockedUntil: null } })
  }

  async revokeTokens(userId: string, at: Date): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { tokensValidAfter: at } })
  }

  async changePassword(userId: string, hashedPassword: string, tokensValidAfter: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokensValidAfter,
        loginAttempts: 0,
        lockedUntil: null,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
  }
}
