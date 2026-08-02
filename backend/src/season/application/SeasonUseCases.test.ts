import { describe, it, expect, vi } from 'vitest'
import { SeasonUseCases } from './SeasonUseCases.js'
import type { ISeasonRepository } from '../ports/ISeasonRepository.js'
import { SeasonNotFoundError, SeasonHasUnfinishedChampionshipsError } from '../domain/SeasonErrors.js'
import type { ChampionshipUseCases } from '../../championship/application/ChampionshipUseCases.js'

const mockSeason = {
  id: 'season-1',
  label: '2024-2025',
  startDate: new Date('2024-09-01'),
  endDate: new Date('2025-06-30'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const makeRepo = (overrides: Partial<ISeasonRepository> = {}): ISeasonRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockSeason]),
  findById: vi.fn().mockResolvedValue(mockSeason),
  create: vi.fn().mockResolvedValue(mockSeason),
  update: vi.fn().mockResolvedValue({ ...mockSeason, label: '2024-2025 modifiée' }),
  softDelete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const makeChampionshipUseCases = (hasUnfinished = false): ChampionshipUseCases =>
  ({ hasUnfinishedChampionships: vi.fn().mockResolvedValue(hasUnfinished) }) as unknown as ChampionshipUseCases

describe('SeasonUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new SeasonUseCases(makeRepo(), makeChampionshipUseCases()).count()).toBe(1)
  })
})

describe('SeasonUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new SeasonUseCases(makeRepo(), makeChampionshipUseCases()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('SeasonUseCases.getById', () => {
  it('returns season when found', async () => {
    const result = await new SeasonUseCases(makeRepo(), makeChampionshipUseCases()).getById('season-1')
    expect(result.id).toBe('season-1')
  })
  it('throws SeasonNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new SeasonUseCases(repo, makeChampionshipUseCases()).getById('unknown')).rejects.toThrow(
      SeasonNotFoundError
    )
  })
})

describe('SeasonUseCases.create', () => {
  it('creates a season', async () => {
    const repo = makeRepo()
    const input = { label: '2024-2025', startDate: new Date('2024-09-01'), endDate: new Date('2025-06-30') }
    await new SeasonUseCases(repo, makeChampionshipUseCases()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('SeasonUseCases.update', () => {
  it('updates season when found', async () => {
    const result = await new SeasonUseCases(makeRepo(), makeChampionshipUseCases()).update('season-1', {
      label: '2024-2025 modifiée',
    })
    expect(result.label).toBe('2024-2025 modifiée')
  })
  it('throws SeasonNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(
      new SeasonUseCases(repo, makeChampionshipUseCases()).update('unknown', { label: 'x' })
    ).rejects.toThrow(SeasonNotFoundError)
  })
})

describe('SeasonUseCases.archive', () => {
  it('archives when no unfinished linked championship', async () => {
    const repo = makeRepo()
    await new SeasonUseCases(repo, makeChampionshipUseCases(false)).archive('season-1')
    expect(repo.softDelete).toHaveBeenCalledWith('season-1')
  })
  it('throws SeasonHasUnfinishedChampionshipsError when a linked championship is unfinished', async () => {
    const repo = makeRepo()
    await expect(new SeasonUseCases(repo, makeChampionshipUseCases(true)).archive('season-1')).rejects.toThrow(
      SeasonHasUnfinishedChampionshipsError
    )
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('throws SeasonNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new SeasonUseCases(repo, makeChampionshipUseCases()).archive('unknown')).rejects.toThrow(
      SeasonNotFoundError
    )
  })
})
