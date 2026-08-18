import { describe, it, expect, vi } from 'vitest'
import { MatchUseCases } from './MatchUseCases.js'
import type { IMatchRepository } from '../ports/IMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import { MatchStatus } from '../domain/Match.js'
import type { BracketUseCases } from '../../bracket/application/BracketUseCases.js'

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

describe('MatchUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new MatchUseCases(makeRepo(), makeBracketUseCases()).count()).toBe(1)
  })

  it('passes undefined filters to repo when none provided', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).count()
    expect(repo.count).toHaveBeenCalledWith(undefined)
  })

  it('passes championshipId/ageCategoryId filters to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).count({
      championshipId: 'champ-1',
      ageCategoryId: 'cat-1',
    })
    expect(repo.count).toHaveBeenCalledWith({ championshipId: 'champ-1', ageCategoryId: 'cat-1' })
  })
})

describe('MatchUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new MatchUseCases(makeRepo(), makeBracketUseCases()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })

  it('passes undefined filters to repo when none provided', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, undefined)
  })

  it('passes status filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll(
      { page: 1, count: 20 },
      { status: MatchStatus.SCHEDULED }
    )
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED })
  })

  it('passes pastDue filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { pastDue: true })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { pastDue: true })
  })

  it('passes combined filters to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll(
      { page: 1, count: 20 },
      { status: MatchStatus.SCHEDULED, pastDue: true }
    )
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED, pastDue: true })
  })

  it('passes championshipId filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { championshipId: 'champ-1' })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { championshipId: 'champ-1' })
  })

  it('passes ageCategoryId filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo, makeBracketUseCases()).getAll({ page: 1, count: 20 }, { ageCategoryId: 'cat-1' })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { ageCategoryId: 'cat-1' })
  })
})

describe('MatchUseCases.getById', () => {
  it('returns match when found', async () => {
    const result = await new MatchUseCases(makeRepo(), makeBracketUseCases()).getById('match-1')
    expect(result.id).toBe('match-1')
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo, makeBracketUseCases()).getById('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})

describe('MatchUseCases.getByGroupId', () => {
  it('returns matches for the group', async () => {
    const result = await new MatchUseCases(makeRepo(), makeBracketUseCases()).getByGroupId('group-1')
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
    await new MatchUseCases(repo, makeBracketUseCases()).create(input)
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
    await new MatchUseCases(repo, makeBracketUseCases()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('MatchUseCases.update', () => {
  it('updates match when found', async () => {
    const result = await new MatchUseCases(makeRepo(), makeBracketUseCases()).update('match-1', {
      scheduledAt: new Date('2026-05-02T15:00:00Z'),
    })
    expect(result.scheduledAt).toEqual(new Date('2026-05-02T15:00:00Z'))
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo, makeBracketUseCases()).update('unknown', {})).rejects.toThrow(
      MatchNotFoundError
    )
  })
  it('does not call advanceWinner for a non-bracket match', async () => {
    const repo = makeRepo()
    const bracketUseCases = makeBracketUseCases()
    await new MatchUseCases(repo, bracketUseCases).update('match-1', { homeGoals: 2, awayGoals: 1 })
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
    await new MatchUseCases(repo, bracketUseCases).update('match-1', {
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
    await new MatchUseCases(repo, bracketUseCases).update('match-1', {
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
    await new MatchUseCases(repo, bracketUseCases).update('match-1', { scheduledAt: new Date() })
    expect(bracketUseCases.advanceWinner).not.toHaveBeenCalled()
  })
})

describe('MatchUseCases.delete', () => {
  it('hard deletes SCHEDULED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.SCHEDULED }) })
    await new MatchUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.delete).toHaveBeenCalledWith('match-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('hard deletes CANCELLED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.CANCELLED }) })
    await new MatchUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.delete).toHaveBeenCalledWith('match-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes PLAYED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.PLAYED }) })
    await new MatchUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.softDelete).toHaveBeenCalledWith('match-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('soft deletes FORFEITED match', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue({ ...mockMatch, status: MatchStatus.FORFEITED }) })
    await new MatchUseCases(repo, makeBracketUseCases()).delete('match-1')
    expect(repo.softDelete).toHaveBeenCalledWith('match-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo, makeBracketUseCases()).delete('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})
