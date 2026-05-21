import { describe, it, expect, vi } from 'vitest'
import { MatchUseCases } from './MatchUseCases.js'
import type { IMatchRepository } from '../ports/IMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import { MatchStatus } from '../domain/Match.js'

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
  create: vi.fn().mockResolvedValue(mockMatch),
  update: vi.fn().mockResolvedValue({ ...mockMatch, scheduledAt: new Date('2026-05-02T15:00:00Z') }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('MatchUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new MatchUseCases(makeRepo()).count()).toBe(1)
  })
})

describe('MatchUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new MatchUseCases(makeRepo()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })

  it('passes undefined filters to repo when none provided', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo).getAll({ page: 1, count: 20 })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, undefined)
  })

  it('passes status filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo).getAll({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED })
  })

  it('passes pastDue filter to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo).getAll({ page: 1, count: 20 }, { pastDue: true })
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, count: 20 }, { pastDue: true })
  })

  it('passes combined filters to repo', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo).getAll({ page: 1, count: 20 }, { status: MatchStatus.SCHEDULED, pastDue: true })
    expect(repo.findAll).toHaveBeenCalledWith(
      { page: 1, count: 20 },
      { status: MatchStatus.SCHEDULED, pastDue: true },
    )
  })
})

describe('MatchUseCases.getById', () => {
  it('returns match when found', async () => {
    const result = await new MatchUseCases(makeRepo()).getById('match-1')
    expect(result.id).toBe('match-1')
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo).getById('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})

describe('MatchUseCases.getByGroupId', () => {
  it('returns matches for the group', async () => {
    const result = await new MatchUseCases(makeRepo()).getByGroupId('group-1')
    expect(result).toHaveLength(1)
    expect(result[0].groupId).toBe('group-1')
  })
})

describe('MatchUseCases.create', () => {
  it('creates a match', async () => {
    const repo = makeRepo()
    const input = {
      groupId: 'group-1',
      scheduledAt: new Date('2026-05-01T15:00:00Z'),
      area: mockArea,
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      homeGoals: null,
      awayGoals: null,
      forfeitedBy: null,
    }
    await new MatchUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('MatchUseCases.update', () => {
  it('updates match when found', async () => {
    const result = await new MatchUseCases(makeRepo()).update('match-1', {
      scheduledAt: new Date('2026-05-02T15:00:00Z'),
    })
    expect(result.scheduledAt).toEqual(new Date('2026-05-02T15:00:00Z'))
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo).update('unknown', {})).rejects.toThrow(MatchNotFoundError)
  })
})

describe('MatchUseCases.delete', () => {
  it('deletes match when found', async () => {
    const repo = makeRepo()
    await new MatchUseCases(repo).delete('match-1')
    expect(repo.delete).toHaveBeenCalledWith('match-1')
  })
  it('throws MatchNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new MatchUseCases(repo).delete('unknown')).rejects.toThrow(MatchNotFoundError)
  })
})
