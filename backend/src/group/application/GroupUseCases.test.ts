import { describe, it, expect, vi } from 'vitest'
import { GroupUseCases } from './GroupUseCases.js'
import type { IGroupRepository } from '../ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import { GroupNotFoundError, GroupLockedError } from '../domain/GroupErrors.js'
import { MatchMode } from '../domain/Group.js'
import type { Match } from '../../match/domain/Match.js'
import { MatchStatus } from '../../match/domain/Match.js'

const mockGroup = {
  id: 'group-1',
  phaseId: 'phase-1',
  name: 'Poule A',
  matchMode: MatchMode.HOME_AND_AWAY,
  teamIds: ['team-1', 'team-2', 'team-3'],
}

const makeRepo = (overrides: Partial<IGroupRepository> = {}): IGroupRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([mockGroup]),
  findById: vi.fn().mockResolvedValue(mockGroup),
  create: vi.fn().mockResolvedValue(mockGroup),
  update: vi.fn().mockResolvedValue({ ...mockGroup, name: 'Poule B' }),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeMatchRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(0),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  findByGroupId: vi.fn().mockResolvedValue([]),
  findByBracketId: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockImplementation(input => Promise.resolve({ id: 'match-new', updatedAt: new Date(), ...input })),
  update: vi.fn().mockImplementation((id, input) => Promise.resolve({ id, ...input })),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const baseMatch: Match = {
  id: 'match-1',
  groupId: 'group-1',
  bracketId: null,
  round: null,
  bracketPosition: null,
  status: MatchStatus.SCHEDULED,
  scheduledAt: null,
  area: null,
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeGoals: null,
  awayGoals: null,
  forfeitedBy: null,
  updatedAt: new Date(),
}

describe('GroupUseCases.getByPhaseId', () => {
  it('returns groups for the phase', async () => {
    const result = await new GroupUseCases(makeRepo(), makeMatchRepo()).getByPhaseId('phase-1')
    expect(result).toHaveLength(1)
    expect(result[0].phaseId).toBe('phase-1')
  })
})

describe('GroupUseCases.getById', () => {
  it('returns group when found', async () => {
    const result = await new GroupUseCases(makeRepo(), makeMatchRepo()).getById('group-1')
    expect(result.id).toBe('group-1')
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo, makeMatchRepo()).getById('unknown')).rejects.toThrow(GroupNotFoundError)
  })
})

describe('GroupUseCases.create', () => {
  it('creates a group', async () => {
    const repo = makeRepo()
    const input = {
      phaseId: 'phase-1',
      name: 'Poule A',
      matchMode: MatchMode.HOME_AND_AWAY,
      teamIds: ['team-1', 'team-2'],
    }
    await new GroupUseCases(repo, makeMatchRepo()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('GroupUseCases.update', () => {
  it('updates group when found', async () => {
    const result = await new GroupUseCases(makeRepo(), makeMatchRepo()).update('group-1', { name: 'Poule B' })
    expect(result.name).toBe('Poule B')
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo, makeMatchRepo()).update('unknown', {})).rejects.toThrow(GroupNotFoundError)
  })
})

describe('GroupUseCases.delete', () => {
  it('hard deletes when no played matches', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(false) })
    await new GroupUseCases(repo, makeMatchRepo()).delete('group-1')
    expect(repo.delete).toHaveBeenCalledWith('group-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes when played matches exist', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    await new GroupUseCases(repo, makeMatchRepo()).delete('group-1')
    expect(repo.softDelete).toHaveBeenCalledWith('group-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo, makeMatchRepo()).delete('unknown')).rejects.toThrow(GroupNotFoundError)
  })
})

describe('GroupUseCases.generateMatches', () => {
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo, makeMatchRepo()).generateMatches('unknown')).rejects.toThrow(GroupNotFoundError)
  })

  it('throws GroupLockedError when a match already has a score', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    await expect(new GroupUseCases(repo, makeMatchRepo()).generateMatches('group-1')).rejects.toThrow(GroupLockedError)
  })

  it('deletes existing matches then creates the round-robin plan', async () => {
    const matchRepo = makeMatchRepo({ findByGroupId: vi.fn().mockResolvedValue([{ ...baseMatch, id: 'stale-match' }]) })
    const result = await new GroupUseCases(makeRepo(), matchRepo).generateMatches('group-1')
    expect(matchRepo.delete).toHaveBeenCalledWith('stale-match')
    // 3 teams, HOME_AND_AWAY: 3 SINGLE pairs * 2 legs = 6 matches
    expect(result).toHaveLength(6)
    expect(matchRepo.create).toHaveBeenCalledTimes(6)
    expect(matchRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ groupId: 'group-1', bracketId: null, round: null, bracketPosition: null })
    )
  })
})