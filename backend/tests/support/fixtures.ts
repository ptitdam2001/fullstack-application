import bcrypt from 'bcrypt'
import { AgeCategory, MatchMode, PhaseType, TeamRole, type Championship, type Group, type Phase, type Team, type User } from '@prisma/client'
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

export const createChampionship = (
  overrides: Partial<{ name: string; ageCategory: AgeCategory; season: string }> = {}
): Promise<Championship> =>
  prisma.championship.create({
    data: {
      name: unique('Championnat'),
      ageCategory: AgeCategory.U13,
      season: '2025-2026',
      pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
      ...overrides,
    },
  })

export const createPhase = (
  championshipId: string,
  overrides: Partial<{ type: PhaseType; order: number; name: string | null }> = {}
): Promise<Phase> =>
  prisma.phase.create({
    data: {
      championshipId,
      type: PhaseType.GROUP,
      order: 1,
      ...overrides,
    },
  })

export const createGroup = (
  phaseId: string,
  overrides: Partial<{ name: string; matchMode: MatchMode; teamIds: string[] }> = {}
): Promise<Group> => {
  const { teamIds = [], ...rest } = overrides
  return prisma.group.create({
    data: {
      phaseId,
      name: unique('Poule'),
      matchMode: MatchMode.SINGLE,
      ...rest,
      groupTeams: { create: teamIds.map((teamId) => ({ teamId })) },
    },
  })
}

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
