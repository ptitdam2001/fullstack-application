import { describe, it, expect, vi } from 'vitest'
import { ChampionshipUseCases } from './ChampionshipUseCases.js'
import type { IChampionshipRepository } from '../ports/IChampionshipRepository.js'
import { ChampionshipNotFoundError } from '../domain/ChampionshipErrors.js'
import { AgeCategory } from '../domain/Championship.js'

const mockChampionship = {
  id: 'championship-1',
  name: 'Championnat U13 2024',
  ageCategory: AgeCategory.U13,
  season: '2024-2025',
  startDate: new Date('2024-09-01'),
  endDate: new Date('2025-05-31'),
  pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
}

const makeRepo = (overrides: Partial<IChampionshipRepository> = {}): IChampionshipRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockChampionship]),
  findById: vi.fn().mockResolvedValue(mockChampionship),
  create: vi.fn().mockResolvedValue(mockChampionship),
  update: vi.fn().mockResolvedValue({ ...mockChampionship, name: 'Championnat U13 2024 - Saison modifiée' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('ChampionshipUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new ChampionshipUseCases(makeRepo()).count()).toBe(1)
  })
})

describe('ChampionshipUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new ChampionshipUseCases(makeRepo()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('ChampionshipUseCases.getById', () => {
  it('returns championship when found', async () => {
    const result = await new ChampionshipUseCases(makeRepo()).getById('championship-1')
    expect(result.id).toBe('championship-1')
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new ChampionshipUseCases(repo).getById('unknown')).rejects.toThrow(ChampionshipNotFoundError)
  })
})

describe('ChampionshipUseCases.create', () => {
  it('creates a championship', async () => {
    const repo = makeRepo()
    const input = {
      name: 'Championnat U13 2024',
      ageCategory: AgeCategory.U13,
      season: '2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
    }
    await new ChampionshipUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('ChampionshipUseCases.update', () => {
  it('updates championship when found', async () => {
    const repo = makeRepo()
    const result = await new ChampionshipUseCases(repo).update('championship-1', { name: 'Nouveau nom' })
    expect(result.name).toBe('Championnat U13 2024 - Saison modifiée')
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new ChampionshipUseCases(repo).update('unknown', { name: 'x' })).rejects.toThrow(ChampionshipNotFoundError)
  })
})

describe('ChampionshipUseCases.delete', () => {
  it('deletes championship when found', async () => {
    const repo = makeRepo()
    await new ChampionshipUseCases(repo).delete('championship-1')
    expect(repo.delete).toHaveBeenCalledWith('championship-1')
  })
  it('throws ChampionshipNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new ChampionshipUseCases(repo).delete('unknown')).rejects.toThrow(ChampionshipNotFoundError)
  })
})
