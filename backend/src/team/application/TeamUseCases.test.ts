import { describe, it, expect, vi } from 'vitest'
import { TeamUseCases } from './TeamUseCases.js'
import type { ITeamRepository } from '../ports/ITeamRepository.js'
import { TeamNotFoundError } from '../domain/TeamErrors.js'

const mockTeam = { id: 'team-1', name: 'Les Bleus', color: '#0000FF' }

const makeRepo = (overrides: Partial<ITeamRepository> = {}): ITeamRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockTeam]),
  findById: vi.fn().mockResolvedValue(mockTeam),
  create: vi.fn().mockResolvedValue(mockTeam),
  update: vi.fn().mockResolvedValue({ ...mockTeam, name: 'Updated' }),
  delete: vi.fn().mockResolvedValue(undefined),
  findPlayers: vi.fn().mockResolvedValue([]),
  findCalendar: vi.fn().mockResolvedValue([]),
  ...overrides,
})

describe('TeamUseCases.count', () => {
  it('returns the team count', async () => {
    const useCases = new TeamUseCases(makeRepo())
    expect(await useCases.count()).toBe(1)
  })
})

describe('TeamUseCases.getAll', () => {
  it('returns all teams', async () => {
    const useCases = new TeamUseCases(makeRepo())
    const teams = await useCases.getAll()
    expect(teams).toHaveLength(1)
    expect(teams[0].id).toBe('team-1')
  })
})

describe('TeamUseCases.getById', () => {
  it('returns team when found', async () => {
    const useCases = new TeamUseCases(makeRepo())
    const team = await useCases.getById('team-1')
    expect(team.name).toBe('Les Bleus')
  })

  it('throws TeamNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCases = new TeamUseCases(repo)
    await expect(useCases.getById('unknown')).rejects.toThrow(TeamNotFoundError)
  })
})

describe('TeamUseCases.create', () => {
  it('creates a team', async () => {
    const repo = makeRepo()
    const useCases = new TeamUseCases(repo)
    await useCases.create({ name: 'Les Bleus', color: '#0000FF' })
    expect(repo.create).toHaveBeenCalledWith({ name: 'Les Bleus', color: '#0000FF' })
  })
})

describe('TeamUseCases.update', () => {
  it('updates team when found', async () => {
    const useCases = new TeamUseCases(makeRepo())
    const result = await useCases.update('team-1', { name: 'Updated' })
    expect(result.name).toBe('Updated')
  })

  it('throws TeamNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCases = new TeamUseCases(repo)
    await expect(useCases.update('unknown', { name: 'X' })).rejects.toThrow(TeamNotFoundError)
  })
})

describe('TeamUseCases.delete', () => {
  it('deletes team when found', async () => {
    const repo = makeRepo()
    const useCases = new TeamUseCases(repo)
    await useCases.delete('team-1')
    expect(repo.delete).toHaveBeenCalledWith('team-1')
  })

  it('throws TeamNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCases = new TeamUseCases(repo)
    await expect(useCases.delete('unknown')).rejects.toThrow(TeamNotFoundError)
  })
})

describe('TeamUseCases.getPlayers', () => {
  it('returns players for a team', async () => {
    const useCases = new TeamUseCases(makeRepo())
    const players = await useCases.getPlayers('team-1', { page: 1, count: 20 })
    expect(players).toEqual([])
  })

  it('throws TeamNotFoundError when team does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCases = new TeamUseCases(repo)
    await expect(useCases.getPlayers('unknown', { page: 1, count: 20 })).rejects.toThrow(TeamNotFoundError)
  })
})

describe('TeamUseCases.getCalendar', () => {
  it('returns calendar for a team', async () => {
    const useCases = new TeamUseCases(makeRepo())
    const games = await useCases.getCalendar('team-1', { page: 1, count: 20 })
    expect(games).toEqual([])
  })

  it('throws TeamNotFoundError when team does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCases = new TeamUseCases(repo)
    await expect(useCases.getCalendar('unknown', { page: 1, count: 20 })).rejects.toThrow(TeamNotFoundError)
  })
})
