import { describe, it, expect, vi } from 'vitest'
import { MatchUseCases } from './MatchUseCases.js'
import type { IMatchRepository } from '../ports/IMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'

const mockMatch = {
  id: 'match-1',
  date: new Date('2026-05-01T15:00:00Z'),
  area: null,
  teams: [
    { teamId: 'team-1', score: 2 },
    { teamId: 'team-2', score: 1 },
  ],
}

const makeRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockMatch]),
  findById: vi.fn().mockResolvedValue(mockMatch),
  create: vi.fn().mockResolvedValue(mockMatch),
  update: vi.fn().mockResolvedValue({ ...mockMatch, date: new Date('2026-05-02T15:00:00Z') }),
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

describe('MatchUseCases.create', () => {
  it('creates a match', async () => {
    const repo = makeRepo()
    const input = { date: new Date('2026-05-01T15:00:00Z'), area: null, teams: [] }
    await new MatchUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('MatchUseCases.update', () => {
  it('updates match when found', async () => {
    const result = await new MatchUseCases(makeRepo()).update('match-1', { date: new Date('2026-05-02T15:00:00Z') })
    expect(result.date).toEqual(new Date('2026-05-02T15:00:00Z'))
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
