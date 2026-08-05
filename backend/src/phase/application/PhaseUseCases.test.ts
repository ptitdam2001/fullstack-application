import { describe, it, expect, vi } from 'vitest'
import { PhaseUseCases } from './PhaseUseCases.js'
import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import type { IChampionshipRepository } from '../../championship/ports/IChampionshipRepository.js'
import type { Match } from '../../match/domain/Match.js'
import { MatchStatus } from '../../match/domain/Match.js'
import {
  PhaseNotFoundError,
  PhaseDuplicateOrderError,
  PreviousPhaseNotFinishedError,
  PhaseNotFinishedError,
} from '../domain/PhaseErrors.js'
import { PhaseType } from '../domain/Phase.js'
import { ChampionshipNotFoundError } from '../../championship/domain/ChampionshipErrors.js'
import { MatchMode } from '../../group/domain/Group.js'

const mockPhase = {
  id: 'phase-1',
  championshipId: 'champ-1',
  type: PhaseType.GROUP,
  order: 1,
  name: 'Phase de poules',
  qualification: { maxRank: 1 },
}

const mockChampionship = {
  id: 'champ-1',
  name: 'Championnat U13',
  ageCategoryId: 'age-1',
  seasonId: 'season-1',
  startDate: null,
  endDate: null,
  pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockGroup = {
  id: 'group-1',
  phaseId: 'phase-1',
  name: 'Poule A',
  matchMode: MatchMode.SINGLE,
  teamIds: ['team-1', 'team-2'],
  updatedAt: new Date('2024-01-01'),
}

const makeMatch = (overrides: Partial<Match> = {}): Match => ({
  id: 'match-1',
  groupId: 'group-1',
  bracketId: null,
  round: null,
  bracketPosition: null,
  status: MatchStatus.PLAYED,
  scheduledAt: null,
  area: null,
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeGoals: 2,
  awayGoals: 1,
  forfeitedBy: null,
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

const makeRepo = (overrides: Partial<IPhaseRepository> = {}): IPhaseRepository => ({
  findByChampionshipId: vi.fn().mockResolvedValue([mockPhase]),
  findById: vi.fn().mockResolvedValue(mockPhase),
  create: vi.fn().mockResolvedValue(mockPhase),
  update: vi.fn().mockResolvedValue({ ...mockPhase, name: 'Phase 1 modifiée' }),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  isFinished: vi.fn().mockResolvedValue(true),
  ...overrides,
})

const makeGroupRepo = (overrides: Partial<IGroupRepository> = {}): IGroupRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([mockGroup]),
  findById: vi.fn().mockResolvedValue(mockGroup),
  create: vi.fn().mockResolvedValue(mockGroup),
  update: vi.fn().mockResolvedValue(mockGroup),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeMatchRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(0),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  findByGroupId: vi.fn().mockResolvedValue([makeMatch()]),
  findByBracketId: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockImplementation(input => Promise.resolve({ id: 'match-new', updatedAt: new Date(), ...input })),
  update: vi.fn().mockImplementation((id, input) => Promise.resolve({ id, ...input })),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeChampionshipRepo = (overrides: Partial<IChampionshipRepository> = {}): IChampionshipRepository => ({
  count: vi.fn().mockResolvedValue(0),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(mockChampionship),
  findBySeasonId: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockResolvedValue(mockChampionship),
  update: vi.fn().mockResolvedValue(mockChampionship),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeUseCases = (overrides: {
  phaseRepo?: Partial<IPhaseRepository>
  groupRepo?: Partial<IGroupRepository>
  matchRepo?: Partial<IMatchRepository>
  championshipRepo?: Partial<IChampionshipRepository>
} = {}) =>
  new PhaseUseCases(
    makeRepo(overrides.phaseRepo),
    makeGroupRepo(overrides.groupRepo),
    makeMatchRepo(overrides.matchRepo),
    makeChampionshipRepo(overrides.championshipRepo)
  )

describe('PhaseUseCases.getByChampionshipId', () => {
  it('returns phases for the championship', async () => {
    const result = await makeUseCases().getByChampionshipId('champ-1')
    expect(result).toHaveLength(1)
    expect(result[0].championshipId).toBe('champ-1')
  })
})

describe('PhaseUseCases.getById', () => {
  it('returns phase when found', async () => {
    const result = await makeUseCases().getById('phase-1')
    expect(result.id).toBe('phase-1')
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const useCases = makeUseCases({ phaseRepo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.getById('unknown')).rejects.toThrow(PhaseNotFoundError)
  })
})

describe('PhaseUseCases.create', () => {
  it('creates a phase', async () => {
    const useCases = makeUseCases()
    const input = { championshipId: 'champ-1', type: PhaseType.GROUP, order: 2, name: 'Phase éliminatoire', qualification: null }
    await useCases.create(input)
  })

  it('throws PhaseDuplicateOrderError when order already exists in championship', async () => {
    const phaseRepo = makeRepo()
    const useCases = makeUseCases({ phaseRepo })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 1, name: 'Phase éliminatoire', qualification: null }
    await expect(useCases.create(input)).rejects.toThrow(PhaseDuplicateOrderError)
    expect(phaseRepo.create).not.toHaveBeenCalled()
  })

  it('allows same order in different championships', async () => {
    const phaseRepo = makeRepo({ findByChampionshipId: vi.fn().mockResolvedValue([]) })
    const useCases = makeUseCases({ phaseRepo })
    const input = { championshipId: 'champ-2', type: PhaseType.GROUP, order: 1, name: 'Phase de poules', qualification: null }
    await useCases.create(input)
    expect(phaseRepo.create).toHaveBeenCalledWith(input)
  })

  it('creates order > 1 when previous phase is finished', async () => {
    const phaseRepo = makeRepo({ isFinished: vi.fn().mockResolvedValue(true) })
    const useCases = makeUseCases({ phaseRepo })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 2, name: 'Phase finale', qualification: null }
    await useCases.create(input)
    expect(phaseRepo.isFinished).toHaveBeenCalledWith('phase-1')
    expect(phaseRepo.create).toHaveBeenCalledWith(input)
  })

  it('throws PreviousPhaseNotFinishedError when previous phase is not finished', async () => {
    const phaseRepo = makeRepo({ isFinished: vi.fn().mockResolvedValue(false) })
    const useCases = makeUseCases({ phaseRepo })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 2, name: 'Phase finale', qualification: null }
    await expect(useCases.create(input)).rejects.toThrow(PreviousPhaseNotFinishedError)
    expect(phaseRepo.create).not.toHaveBeenCalled()
  })

  it('throws PreviousPhaseNotFinishedError when previous phase does not exist', async () => {
    const phaseRepo = makeRepo({ findByChampionshipId: vi.fn().mockResolvedValue([]) })
    const useCases = makeUseCases({ phaseRepo })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 3, name: 'Phase finale', qualification: null }
    await expect(useCases.create(input)).rejects.toThrow(PreviousPhaseNotFinishedError)
    expect(phaseRepo.create).not.toHaveBeenCalled()
  })
})

describe('PhaseUseCases.update', () => {
  it('updates phase when found', async () => {
    const result = await makeUseCases().update('phase-1', { name: 'Phase 1 modifiée' })
    expect(result.name).toBe('Phase 1 modifiée')
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const useCases = makeUseCases({ phaseRepo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.update('unknown', {})).rejects.toThrow(PhaseNotFoundError)
  })
})

describe('PhaseUseCases.delete', () => {
  it('hard deletes when no played matches', async () => {
    const phaseRepo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(false) })
    const useCases = makeUseCases({ phaseRepo })
    await useCases.delete('phase-1')
    expect(phaseRepo.delete).toHaveBeenCalledWith('phase-1')
    expect(phaseRepo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes when played matches exist', async () => {
    const phaseRepo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    const useCases = makeUseCases({ phaseRepo })
    await useCases.delete('phase-1')
    expect(phaseRepo.softDelete).toHaveBeenCalledWith('phase-1')
    expect(phaseRepo.delete).not.toHaveBeenCalled()
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const useCases = makeUseCases({ phaseRepo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.delete('unknown')).rejects.toThrow(PhaseNotFoundError)
  })
})

describe('PhaseUseCases.getQualifiedTeams', () => {
  it('throws PhaseNotFoundError when phase not found', async () => {
    const useCases = makeUseCases({ phaseRepo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.getQualifiedTeams('unknown')).rejects.toThrow(PhaseNotFoundError)
  })

  it('throws PhaseNotFinishedError when phase is not finished', async () => {
    const useCases = makeUseCases({ phaseRepo: { isFinished: vi.fn().mockResolvedValue(false) } })
    await expect(useCases.getQualifiedTeams('phase-1')).rejects.toThrow(PhaseNotFinishedError)
  })

  it('throws ChampionshipNotFoundError when championship is missing', async () => {
    const useCases = makeUseCases({ championshipRepo: { findById: vi.fn().mockResolvedValue(null) } })
    await expect(useCases.getQualifiedTeams('phase-1')).rejects.toThrow(ChampionshipNotFoundError)
  })

  it('returns teams ranked at or above qualification.maxRank, per group', async () => {
    const matches = [
      makeMatch({ id: 'm1', homeTeamId: 'team-1', awayTeamId: 'team-2', homeGoals: 3, awayGoals: 0 }),
      makeMatch({ id: 'm2', homeTeamId: 'team-2', awayTeamId: 'team-1', homeGoals: 0, awayGoals: 1 }),
    ]
    const useCases = makeUseCases({
      matchRepo: { findByGroupId: vi.fn().mockResolvedValue(matches) },
    })
    const result = await useCases.getQualifiedTeams('phase-1')
    expect(result).toEqual([{ teamId: 'team-1', groupId: 'group-1', rank: 1 }])
  })

  it('returns an empty list when the phase has no qualification config', async () => {
    const useCases = makeUseCases({ phaseRepo: { findById: vi.fn().mockResolvedValue({ ...mockPhase, qualification: null }) } })
    const result = await useCases.getQualifiedTeams('phase-1')
    expect(result).toEqual([])
  })
})