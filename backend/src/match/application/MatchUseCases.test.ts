import { describe, it, expect, vi } from 'vitest'
import { MatchUseCases } from './MatchUseCases.js'
import type { IMatchRepository } from '../ports/IMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import { MatchStatus } from '../domain/Match.js'
import type { BracketUseCases } from '../../bracket/application/BracketUseCases.js'
import type { IGroupRepository } from '../../group/ports/IGroupRepository.js'
import type { IBracketRepository } from '../../bracket/ports/IBracketRepository.js'
import type { IPhaseRepository } from '../../phase/ports/IPhaseRepository.js'
import type { IChampionshipRepository } from '../../championship/ports/IChampionshipRepository.js'
import type { ITeamRepository } from '../../team/ports/ITeamRepository.js'
import { PhaseType } from '../../phase/domain/Phase.js'

const mockArea = {
  id: 'area-1',
  name: 'Stade',
  address: '1 rue du sport',
  city: 'Lyon',
  longitude: 4.83,
  latitude: 45.75,
}

const mockMatch = {
  id: 'match-1',
  groupId: 'group-1',
  bracketId: null,
  round: null,
  bracketPosition: null,
  status: MatchStatus.SCHEDULED,
  scheduledAt: new Date('2026-05-01T15:00:00Z'),
  area: mockArea,
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeGoals: null,
  awayGoals: null,
  forfeitedBy: null,
}

const makeRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockMatch]),
  findById: vi.fn().mockResolvedValue(mockMatch),
  findByGroupId: vi.fn().mockResolvedValue([mockMatch]),
  findByBracketId: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockResolvedValue(mockMatch),
  update: vi.fn().mockResolvedValue({ ...mockMatch, scheduledAt: new Date('2026-05-02T15:00:00Z') }),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeBracketUseCases = (): BracketUseCases =>
  ({ advanceWinner: vi.fn().mockResolvedValue(undefined) }) as unknown as BracketUseCases

const makeGroupRepo = (overrides: Partial<IGroupRepository> = {}): IGroupRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  hasPlayedMatches: vi.fn(),
  ...overrides,
})

const makeBracketRepo = (overrides: Partial<IBracketRepository> = {}): IBracketRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  hasPlayedMatches: vi.fn(),
  ...overrides,
})

const makePhaseRepo = (overrides: Partial<IPhaseRepository> = {}): IPhaseRepository => ({
  findByChampionshipId: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  hasPlayedMatches: vi.fn(),
  isFinished: vi.fn(),
  ...overrides,
})

const makeChampionshipRepo = (overrides: Partial<IChampionshipRepository> = {}): IChampionshipRepository => ({
  count: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn().mockResolvedValue(null),
  findBySeasonId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  hasPlayedMatches: vi.fn(),
  ...overrides,
})

const makeTeamRepo = (overrides: Partial<ITeamRepository> = {}): ITeamRepository => ({
  count: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findPlayers: vi.fn(),
  findCalendar: vi.fn(),
  createWithCoach: vi.fn(),
  findCurrentGroup: vi.fn(),
  ...overrides,
})

const makeUseCases = (
  repo: IMatchRepository = makeRepo(),
  bracketUseCases: BracketUseCases = makeBracketUseCases(),
  extra: {
    groupRepo?: IGroupRepository
    bracketRepo?: IBracketRepository
    phaseRepo?: IPhaseRepository
    championshipRepo?: IChampionshipRepository
    teamRepo?: ITeamRepository
  } = {}
) =>
  new MatchUseCases(
    repo,
    bracketUseCases,
    extra.groupRepo ?? makeGroupRepo(),
    extra.bracketRepo ?? makeBracketRepo(),
    extra.phaseRepo ?? makePhaseRepo(),
    extra.championshipRepo ?? makeChampionshipRepo(),
    extra.teamRepo ?? makeTeamRepo()
  )

describe('MatchUseCases.count', () => {
  it('returns the count', async () => {
    expect(await makeUseCases(makeRepo(), makeBracketUseCases()).count()).toBe(1)
  })

  it('passes undefined filters to repo when none provided', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).count()
    expect(repo.count).toHaveBeenCalledWith(undefined)
  })

  it('passes championshipId/ageCategoryId filters to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).count({
      championshipId: 'champ-1',
      ageCategoryId: 'cat-1',
    })
    expect(repo.count).toHaveBeenCalledWith({ championshipId: 'champ-1', ageCategoryId: 'cat-1' })
  })
})

describe('MatchUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await makeUseCases(makeRepo(), makeBracketUseCases()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })

  it('passes undefined filters to repo when none provided', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, undefined)
  })

  it('passes status filter to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED })
  })

  it('passes pastDue filter to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { pastDue: true })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { pastDue: true })
  })

  it('passes combined filters to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll(
      { page: 1, count: 20 },
      { status: MatchStatus.SCHEDULED, pastDue: true }
    )
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED, pastDue: true })
  })

  it('passes championshipId filter to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { championshipId: 'champ-1' })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { championshipId: 'champ-1' })
  })

  it('passes ageCategoryId filter to repo', async () => {
    const repo = makeRepo()
    await makeUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { ageCategoryId: 'cat-1' })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { ageCategoryId: 'cat-1' })
  })
})

describe('MatchUseCases.getById', () => {
  it('returns match when found', async () => {
    const result = await makeUseCases(makeRepo(), makeBracketUseCases()).getById('match-1')
    expect(result.id).toBe('match-1')
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(makeUseCases(repo, makeBracketUseCases()).getById('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})

describe('MatchUseCases display data enrichment', () => {
  const mockGroup = { id: 'group-1', phaseId: 'phase-1', name: 'Poule A' }
  const mockBracket = { id: 'bracket-1', phaseId: 'phase-1', name: 'Quart de finale' }
  const mockPhase = { id: 'phase-1', championshipId: 'champ-1', type: PhaseType.GROUP }
  const mockChampionship = { id: 'champ-1', name: 'Championnat U13' }
  const mockHomeTeam = { id: 'team-1', name: 'Les Aigles', color: '#FF0000' }
  const mockAwayTeam = { id: 'team-2', name: 'Les Lions', color: '#0000FF' }

  it('resolves championshipName/stageName/teams for a group match', async () => {
    const useCases = makeUseCases(makeRepo(), makeBracketUseCases(), {
      groupRepo: makeGroupRepo({ findById: vi.fn().mockResolvedValue(mockGroup) }),
      phaseRepo: makePhaseRepo({ findById: vi.fn().mockResolvedValue(mockPhase) }),
      championshipRepo: makeChampionshipRepo({ findById: vi.fn().mockResolvedValue(mockChampionship) }),
      teamRepo: makeTeamRepo({
        findById: vi
          .fn()
          .mockImplementation((id: string) => Promise.resolve(id === 'team-1' ? mockHomeTeam : mockAwayTeam)),
      }),
    })
    const result = await useCases.getById('match-1')
    expect(result.championshipName).toBe('Championnat U13')
    expect(result.stageName).toBe('Poule A')
    expect(result.homeTeam).toEqual(mockHomeTeam)
    expect(result.awayTeam).toEqual(mockAwayTeam)
  })

  it('resolves championshipName/stageName for a bracket match', async () => {
    const repo = makeRepo({
      findById: vi.fn().mockResolvedValue({ ...mockMatch, groupId: null, bracketId: 'bracket-1' }),
    })
    const useCases = makeUseCases(repo, makeBracketUseCases(), {
      bracketRepo: makeBracketRepo({ findById: vi.fn().mockResolvedValue(mockBracket) }),
      phaseRepo: makePhaseRepo({ findById: vi.fn().mockResolvedValue(mockPhase) }),
      championshipRepo: makeChampionshipRepo({ findById: vi.fn().mockResolvedValue(mockChampionship) }),
    })
    const result = await useCases.getById('match-1')
    expect(result.championshipName).toBe('Championnat U13')
    expect(result.stageName).toBe('Quart de finale')
  })

  it('returns null display fields when teams and stage are not yet resolvable', async () => {
    const repo = makeRepo({
      findById: vi
        .fn()
        .mockResolvedValue({ ...mockMatch, groupId: null, bracketId: null, homeTeamId: null, awayTeamId: null }),
    })
    const result = await makeUseCases(repo, makeBracketUseCases()).getById('match-1')
    expect(result.championshipName).toBeNull()
    expect(result.stageName).toBeNull()
    expect(result.homeTeam).toBeNull()
    expect(result.awayTeam).toBeNull()
  })

  it('enriches every match returned by getAll', async () => {
    const repo = makeRepo({ findAll: vi.fn().mockResolvedValue([mockMatch]) })
    const useCases = makeUseCases(repo, makeBracketUseCases(), {
      groupRepo: makeGroupRepo({ findById: vi.fn().mockResolvedValue(mockGroup) }),
      phaseRepo: makePhaseRepo({ findById: vi.fn().mockResolvedValue(mockPhase) }),
      championshipRepo: makeChampionshipRepo({ findById: vi.fn().mockResolvedValue(mockChampionship) }),
    })
    const [result] = await useCases.getAll({ page: 1, count: 20 })
    expect(result.championshipName).toBe('Championnat U13')
    expect(result.stageName).toBe('Poule A')
  })
})

describe('MatchUseCases.getByGroupId', () => {
  it('returns matches for the group', async () => {
    const result = await makeUseCases(makeRepo(), makeBracketUseCases()).getByGroupId('group-1')
    expect(result).toHaveLength(1)
    expect(result[0].groupId).toBe('group-1')
  })
})

describe('MatchUseCases.create', () => {
  it('creates a match', async () => {
    const repo = makeRepo()
    const input = {
      groupId: 'group-1',
      bracketId: null,
      round: null,
      bracketPosition: null,
      scheduledAt: new Date('2026-05-01T15:00:00Z'),
      area: mockArea,
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeGoals: null,
      awayGoals: null,
      forfeitedBy: null,
    }
    await makeUseCases(repo, makeBracketUseCases()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })

  it('creates a match without area', async () => {
    const repo = makeRepo()
    const input = {
      groupId: 'group-1',
      bracketId: null,
      round: null,
      bracketPosition: null,
      scheduledAt: null,
      area: null,
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeGoals: null,
      awayGoals: null,
      forfeitedBy: null,
    }
    await makeUseCases(repo, makeBracketUseCases()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('MatchUseCases.update', () => {
  it('updates match when found', async () => {
    const result = await makeUseCases(makeRepo(), makeBracketUseCases()).update('match-1', {
      scheduledAt: new Date('2026-05-02T15:00:00Z'),
    })
    expect(result.scheduledAt).toEqual(new Date('2026-05-02T15:00:00Z'))
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(makeUseCases(repo, makeBracketUseCases()).update('unknown', {})).rejects.toThrow(MatchNotFoundError)
  })
  it('does not call advanceWinner for a non-bracket match', async () => {
    const repo = makeRepo()
    const bracketUseCases = makeBracketUseCases()
    await makeUseCases(repo, bracketUseCases).update('match-1', { homeGoals: 2, awayGoals: 1 })
    expect(bracketUseCases.advanceWinner).not.toHaveBeenCalled()
  })
  it('calls advanceWinner when a bracket match becomes PLAYED', async () => {
    const playedBracketMatch = {
      ...mockMatch,
      bracketId: 'bracket-1',
      round: 1,
      bracketPosition: 1,
      status: MatchStatus.PLAYED,
      homeGoals: 2,
      awayGoals: 1,
    }
    const repo = makeRepo({ update: vi.fn().mockResolvedValue(playedBracketMatch) })
    const bracketUseCases = makeBracketUseCases()
    await makeUseCases(repo, bracketUseCases).update('match-1', {
      homeGoals: 2,
      awayGoals: 1,
      status: MatchStatus.PLAYED,
    })
    expect(bracketUseCases.advanceWinner).toHaveBeenCalledWith(playedBracketMatch)
  })
  it('calls advanceWinner when a bracket match becomes FORFEITED', async () => {
    const forfeitedBracketMatch = {
      ...mockMatch,
      bracketId: 'bracket-1',
      round: 1,
      bracketPosition: 1,
      status: MatchStatus.FORFEITED,
      forfeitedBy: 'team-1',
    }
    const repo = makeRepo({ update: vi.fn().mockResolvedValue(forfeitedBracketMatch) })
    const bracketUseCases = makeBracketUseCases()
    await makeUseCases(repo, bracketUseCases).update('match-1', {
      status: MatchStatus.FORFEITED,
      forfeitedBy: 'team-1',
    })
    expect(bracketUseCases.advanceWinner).toHaveBeenCalledWith(forfeitedBracketMatch)
  })
  it('does not call advanceWinner when a bracket match stays SCHEDULED', async () => {
    const repo = makeRepo({
      update: vi.fn().mockResolvedValue({ ...mockMatch, bracketId: 'bracket-1', round: 1, bracketPosition: 1 }),
    })
    const bracketUseCases = makeBracketUseCases()
    await makeUseCases(repo, bracketUseCases).update('match-1', { scheduledAt: new Date() })
    expect(bracketUseCases.advanceWinner).not.toHaveBeenCalled()
  })
})

describe('MatchUseCases.delete', () => {
  it('hard deletes SCHEDULED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.SCHEDULED }) })
    await makeUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.delete).toHaveBeenCalledWith('match-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('hard deletes CANCELLED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.CANCELLED }) })
    await makeUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.delete).toHaveBeenCalledWith('match-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes PLAYED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.PLAYED }) })
    await makeUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.softDelete).toHaveBeenCalledWith('match-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('soft deletes FORFEITED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.FORFEITED }) })
    await makeUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.softDelete).toHaveBeenCalledWith('match-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(makeUseCases(repo, makeBracketUseCases()).delete('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})
