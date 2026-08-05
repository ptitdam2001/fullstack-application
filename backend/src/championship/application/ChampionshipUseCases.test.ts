import { describe, it, expect, vi } from 'vitest'
import { ChampionshipUseCases } from './ChampionshipUseCases.js'
import type { IChampionshipRepository } from '../ports/IChampionshipRepository.js'
import { ChampionshipNotFoundError } from '../domain/ChampionshipErrors.js'
import type { IPhaseRepository } from '../../phase/ports/IPhaseRepository.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import { PhaseType } from '../../phase/domain/Phase.js'
import { MatchMode } from '../../group/domain/Group.js'
import { MatchStatus } from '../../match/domain/Match.js'

const mockChampionship = {
  id: 'championship-1',
  name: 'Championnat U13 2024',
  ageCategoryId: '507f1f77bcf86cd799439013',
  seasonId: '507f1f77bcf86cd799439099',
  startDate: new Date('2024-09-01'),
  endDate: new Date('2025-05-31'),
  pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
}

const makeRepo = (overrides: Partial<IChampionshipRepository> = {}): IChampionshipRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockChampionship]),
  findById: vi.fn().mockResolvedValue(mockChampionship),
  findBySeasonId: vi.fn().mockResolvedValue([mockChampionship]),
  create: vi.fn().mockResolvedValue(mockChampionship),
  update: vi.fn().mockResolvedValue({ ...mockChampionship, name: 'Championnat U13 2024 - Saison modifiée' }),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makePhaseRepo = (overrides: Partial<IPhaseRepository> = {}): IPhaseRepository => ({
  findByChampionshipId: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  isFinished: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeGroupRepo = (overrides: Partial<IGroupRepository> = {}): IGroupRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeMatchRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(0),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  findByGroupId: vi.fn().mockResolvedValue([]),
  findByBracketId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  ...overrides,
})

const makeUseCases = (overrides: {
  repo?: Partial<IChampionshipRepository>
  phaseRepo?: Partial<IPhaseRepository>
  groupRepo?: Partial<IGroupRepository>
  matchRepo?: Partial<IMatchRepository>
} = {}) =>
  new ChampionshipUseCases(
    makeRepo(overrides.repo),
    makePhaseRepo(overrides.phaseRepo),
    makeGroupRepo(overrides.groupRepo),
    makeMatchRepo(overrides.matchRepo)
  )

describe('ChampionshipUseCases.count', () => {
  it('returns the count', async () => {
    expect(await makeUseCases().count()).toBe(1)
  })
})

describe('ChampionshipUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await makeUseCases().getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('ChampionshipUseCases.getById', () => {
  it('returns championship when found', async () => {
    const result = await makeUseCases().getById('championship-1')
    expect(result.id).toBe('championship-1')
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const useCases = makeUseCases({ repo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.getById('unknown')).rejects.toThrow(ChampionshipNotFoundError)
  })
})

describe('ChampionshipUseCases.create', () => {
  it('creates a championship', async () => {
    const repo = makeRepo()
    const input = {
      name: 'Championnat U13 2024',
      ageCategoryId: '507f1f77bcf86cd799439013',
      seasonId: '507f1f77bcf86cd799439099',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
    }
    await new ChampionshipUseCases(repo, makePhaseRepo(), makeGroupRepo(), makeMatchRepo()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('ChampionshipUseCases.update', () => {
  it('updates championship when found', async () => {
    const result = await makeUseCases().update('championship-1', { name: 'Nouveau nom' })
    expect(result.name).toBe('Championnat U13 2024 - Saison modifiée')
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const useCases = makeUseCases({ repo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.update('unknown', { name: 'x' })).rejects.toThrow(ChampionshipNotFoundError)
  })
})

describe('ChampionshipUseCases.delete', () => {
  it('hard deletes when no played matches', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(false) })
    await new ChampionshipUseCases(repo, makePhaseRepo(), makeGroupRepo(), makeMatchRepo()).delete('championship-1')
    expect(repo.delete).toHaveBeenCalledWith('championship-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes when played matches exist', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    await new ChampionshipUseCases(repo, makePhaseRepo(), makeGroupRepo(), makeMatchRepo()).delete('championship-1')
    expect(repo.softDelete).toHaveBeenCalledWith('championship-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const useCases = makeUseCases({ repo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.delete('unknown')).rejects.toThrow(ChampionshipNotFoundError)
  })
})

describe('ChampionshipUseCases.isChampionshipFinished', () => {
  it('returns false when the championship has no phases', async () => {
    const useCases = makeUseCases({ phaseRepo: { findByChampionshipId: vi.fn().mockResolvedValue([]) } })
    expect(await useCases.isChampionshipFinished('championship-1')).toBe(false)
  })

  it('returns false when the last phase is KNOCKOUT (bracket domain not implemented)', async () => {
    const useCases = makeUseCases({
      phaseRepo: {
        findByChampionshipId: vi
          .fn()
          .mockResolvedValue([{ id: 'phase-1', championshipId: 'championship-1', type: PhaseType.KNOCKOUT, order: 1, name: null, qualification: null, updatedAt: new Date() }]),
      },
    })
    expect(await useCases.isChampionshipFinished('championship-1')).toBe(false)
  })

  it('returns true when the last GROUP phase has no SCHEDULED matches', async () => {
    const useCases = makeUseCases({
      phaseRepo: {
        findByChampionshipId: vi
          .fn()
          .mockResolvedValue([{ id: 'phase-1', championshipId: 'championship-1', type: PhaseType.GROUP, order: 1, name: null, qualification: null, updatedAt: new Date() }]),
      },
      groupRepo: {
        findByPhaseId: vi
          .fn()
          .mockResolvedValue([{ id: 'group-1', phaseId: 'phase-1', name: 'Poule A', matchMode: MatchMode.SINGLE, teamIds: [], updatedAt: new Date() }]),
      },
      matchRepo: {
        findByGroupId: vi.fn().mockResolvedValue([
          { id: 'match-1', groupId: 'group-1', status: MatchStatus.PLAYED, scheduledAt: null, area: null, homeTeamId: 't1', awayTeamId: 't2', homeGoals: 1, awayGoals: 0, forfeitedBy: null, updatedAt: new Date() },
        ]),
      },
    })
    expect(await useCases.isChampionshipFinished('championship-1')).toBe(true)
  })

  it('returns false when the last GROUP phase still has a SCHEDULED match', async () => {
    const useCases = makeUseCases({
      phaseRepo: {
        findByChampionshipId: vi
          .fn()
          .mockResolvedValue([{ id: 'phase-1', championshipId: 'championship-1', type: PhaseType.GROUP, order: 1, name: null, qualification: null, updatedAt: new Date() }]),
      },
      groupRepo: {
        findByPhaseId: vi
          .fn()
          .mockResolvedValue([{ id: 'group-1', phaseId: 'phase-1', name: 'Poule A', matchMode: MatchMode.SINGLE, teamIds: [], updatedAt: new Date() }]),
      },
      matchRepo: {
        findByGroupId: vi.fn().mockResolvedValue([
          { id: 'match-1', groupId: 'group-1', status: MatchStatus.SCHEDULED, scheduledAt: null, area: null, homeTeamId: 't1', awayTeamId: 't2', homeGoals: null, awayGoals: null, forfeitedBy: null, updatedAt: new Date() },
        ]),
      },
    })
    expect(await useCases.isChampionshipFinished('championship-1')).toBe(false)
  })

  it('only inspects the phase with the highest order', async () => {
    const findByPhaseId = vi.fn().mockImplementation((phaseId: string) =>
      Promise.resolve(
        phaseId === 'phase-2'
          ? [{ id: 'group-2', phaseId: 'phase-2', name: 'Poule B', matchMode: MatchMode.SINGLE, teamIds: [], updatedAt: new Date() }]
          : [{ id: 'group-1', phaseId: 'phase-1', name: 'Poule A', matchMode: MatchMode.SINGLE, teamIds: [], updatedAt: new Date() }]
      )
    )
    const findByGroupId = vi.fn().mockImplementation((groupId: string) =>
      Promise.resolve(
        groupId === 'group-2'
          ? [{ id: 'match-2', groupId: 'group-2', status: MatchStatus.PLAYED, scheduledAt: null, area: null, homeTeamId: 't1', awayTeamId: 't2', homeGoals: 2, awayGoals: 1, forfeitedBy: null, updatedAt: new Date() }]
          : [{ id: 'match-1', groupId: 'group-1', status: MatchStatus.SCHEDULED, scheduledAt: null, area: null, homeTeamId: 't1', awayTeamId: 't2', homeGoals: null, awayGoals: null, forfeitedBy: null, updatedAt: new Date() }]
      )
    )
    const useCases = makeUseCases({
      phaseRepo: {
        findByChampionshipId: vi.fn().mockResolvedValue([
          { id: 'phase-1', championshipId: 'championship-1', type: PhaseType.GROUP, order: 1, name: null, qualification: null, updatedAt: new Date() },
          { id: 'phase-2', championshipId: 'championship-1', type: PhaseType.GROUP, order: 2, name: null, qualification: null, updatedAt: new Date() },
        ]),
      },
      groupRepo: { findByPhaseId },
      matchRepo: { findByGroupId },
    })
    expect(await useCases.isChampionshipFinished('championship-1')).toBe(true)
    expect(findByPhaseId).toHaveBeenCalledWith('phase-2')
  })
})

describe('ChampionshipUseCases.hasUnfinishedChampionships', () => {
  it('returns false when the season has no linked championships', async () => {
    const useCases = makeUseCases({ repo: { findBySeasonId: vi.fn().mockResolvedValue([]) } })
    expect(await useCases.hasUnfinishedChampionships('season-1')).toBe(false)
  })

  it('returns true when at least one linked championship is not finished', async () => {
    const useCases = makeUseCases({
      repo: { findBySeasonId: vi.fn().mockResolvedValue([mockChampionship]) },
      phaseRepo: { findByChampionshipId: vi.fn().mockResolvedValue([]) },
    })
    expect(await useCases.hasUnfinishedChampionships('season-1')).toBe(true)
  })

  it('returns false when all linked championships are finished', async () => {
    const useCases = makeUseCases({
      repo: { findBySeasonId: vi.fn().mockResolvedValue([mockChampionship]) },
      phaseRepo: {
        findByChampionshipId: vi
          .fn()
          .mockResolvedValue([{ id: 'phase-1', championshipId: 'championship-1', type: PhaseType.GROUP, order: 1, name: null, qualification: null, updatedAt: new Date() }]),
      },
      groupRepo: { findByPhaseId: vi.fn().mockResolvedValue([]) },
    })
    expect(await useCases.hasUnfinishedChampionships('season-1')).toBe(false)
  })
})
