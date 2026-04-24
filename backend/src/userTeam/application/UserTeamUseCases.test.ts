import { describe, it, expect, vi } from 'vitest'
import { UserTeamUseCases } from './UserTeamUseCases.js'
import type { IUserTeamRepository } from '../ports/IUserTeamRepository.js'
import { TeamRole } from '../domain/UserTeam.js'
import { UserTeamNotFoundError, UserTeamAlreadyExistsError } from '../domain/UserTeamErrors.js'

const mockUserTeam = { id: 'ut-1', userId: 'user-1', teamId: 'team-1', role: TeamRole.COACH }

const makeRepo = (overrides: Partial<IUserTeamRepository> = {}): IUserTeamRepository => ({
  assign: vi.fn().mockResolvedValue(mockUserTeam),
  remove: vi.fn().mockResolvedValue(undefined),
  findByTeamAndRole: vi.fn().mockResolvedValue([mockUserTeam]),
  findByUserAndRole: vi.fn().mockResolvedValue([mockUserTeam]),
  hasRole: vi.fn().mockResolvedValue(false),
  ...overrides,
})

describe('UserTeamUseCases.assign', () => {
  it('assigns a user to a team with a role', async () => {
    const repo = makeRepo()
    const result = await new UserTeamUseCases(repo).assign('user-1', 'team-1', TeamRole.COACH)
    expect(result).toEqual(mockUserTeam)
    expect(repo.assign).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.COACH)
  })

  it('throws UserTeamAlreadyExistsError when assignment already exists', async () => {
    const repo = makeRepo({ hasRole: vi.fn().mockResolvedValue(true) })
    await expect(new UserTeamUseCases(repo).assign('user-1', 'team-1', TeamRole.COACH)).rejects.toThrow(
      UserTeamAlreadyExistsError
    )
  })

  it('allows same user to be COACH and PLAYER in the same team', async () => {
    const repoCoach = makeRepo({ hasRole: vi.fn().mockResolvedValue(false) })
    await new UserTeamUseCases(repoCoach).assign('user-1', 'team-1', TeamRole.COACH)
    expect(repoCoach.assign).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.COACH)

    const repoPlayer = makeRepo({ hasRole: vi.fn().mockResolvedValue(false) })
    await new UserTeamUseCases(repoPlayer).assign('user-1', 'team-1', TeamRole.PLAYER)
    expect(repoPlayer.assign).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.PLAYER)
  })
})

describe('UserTeamUseCases.remove', () => {
  it('removes a user from a team role', async () => {
    const repo = makeRepo({ hasRole: vi.fn().mockResolvedValue(true) })
    await new UserTeamUseCases(repo).remove('user-1', 'team-1', TeamRole.COACH)
    expect(repo.remove).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.COACH)
  })

  it('throws UserTeamNotFoundError when assignment does not exist', async () => {
    const repo = makeRepo({ hasRole: vi.fn().mockResolvedValue(false) })
    await expect(new UserTeamUseCases(repo).remove('user-1', 'team-1', TeamRole.COACH)).rejects.toThrow(
      UserTeamNotFoundError
    )
  })
})

describe('UserTeamUseCases.getTeamMembers', () => {
  it('returns members of a team for a given role', async () => {
    const result = await new UserTeamUseCases(makeRepo()).getTeamMembers('team-1', TeamRole.COACH)
    expect(result).toHaveLength(1)
    expect(result[0].teamId).toBe('team-1')
  })
})

describe('UserTeamUseCases.getUserTeams', () => {
  it('returns teams for a user with a given role', async () => {
    const result = await new UserTeamUseCases(makeRepo()).getUserTeams('user-1', TeamRole.COACH)
    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })
})

describe('UserTeamUseCases.hasRole', () => {
  it('returns true when role exists', async () => {
    const repo = makeRepo({ hasRole: vi.fn().mockResolvedValue(true) })
    expect(await new UserTeamUseCases(repo).hasRole('user-1', 'team-1', TeamRole.COACH)).toBe(true)
  })

  it('returns false when role does not exist', async () => {
    expect(await new UserTeamUseCases(makeRepo()).hasRole('user-1', 'team-1', TeamRole.COACH)).toBe(false)
  })
})
