import bcrypt from 'bcrypt'
import { AgeCategory, TeamRole, type Team, type User } from '@prisma/client'
import { prisma } from '../../utils/prismaClient'

export const FIXTURE_PASSWORD = 'Test@1234'
const SALT_ROUNDS = 10

let passwordHash: string | undefined
const getPasswordHash = async (): Promise<string> => {
  passwordHash ??= await bcrypt.hash(FIXTURE_PASSWORD, SALT_ROUNDS)
  return passwordHash
}

let sequence = 0
const unique = (label: string): string => `${label}-${++sequence}`

interface UserOverrides {
  isAdmin?: boolean
  isReferee?: boolean
  isActive?: boolean
  isBlocked?: boolean
}

export const createUser = async (overrides: UserOverrides = {}): Promise<User> =>
  prisma.user.create({
    data: {
      email: `${unique('user')}@fixtures.local`,
      firstName: 'Test',
      lastName: 'User',
      password: await getPasswordHash(),
      isActive: true,
      ...overrides,
    },
  })

export const createAdmin = (overrides: UserOverrides = {}): Promise<User> => createUser({ isAdmin: true, ...overrides })

export const createTeam = (overrides: Partial<{ name: string; ageCategory: AgeCategory }> = {}): Promise<Team> =>
  prisma.team.create({
    data: {
      name: unique('Team'),
      ageCategory: AgeCategory.Senior,
      ...overrides,
    },
  })

export const assignUserToTeam = (userId: string, teamId: string, role: TeamRole) =>
  prisma.userTeam.create({ data: { userId, teamId, role } })

/**
 * Encodes the invariant documented on the `Player` model (prisma/schema.prisma):
 * every Player profile must have a matching UserTeam(PLAYER) on the same (userId, teamId).
 */
export const createPlayerOfTeam = async (team: Team, jersey?: number): Promise<User> => {
  const player = await createUser()
  await assignUserToTeam(player.id, team.id, TeamRole.PLAYER)
  await prisma.player.create({ data: { userId: player.id, teamId: team.id, jersey } })
  return player
}
