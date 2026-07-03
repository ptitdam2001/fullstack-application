import { describe, it, expect, vi } from 'vitest'
import { AreaUseCases } from './AreaUseCases.js'
import type { IAreaRepository } from '../ports/IAreaRepository.js'
import { AreaNotFoundError } from '../domain/AreaErrors.js'

const mockArea = {
  id: 'area-1',
  name: 'Stade Nord',
  address: '1 rue du Stade',
  city: 'Paris',
  longitude: 2.3522,
  latitude: 48.8566,
  updatedAt: new Date('2024-01-01'),
}

const makeRepo = (overrides: Partial<IAreaRepository> = {}): IAreaRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockArea]),
  findById: vi.fn().mockResolvedValue(mockArea),
  create: vi.fn().mockResolvedValue(mockArea),
  update: vi.fn().mockResolvedValue({ ...mockArea, city: 'Lyon' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('AreaUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new AreaUseCases(makeRepo()).count()).toBe(1)
  })
})

describe('AreaUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new AreaUseCases(makeRepo()).getAll({ page: 0, limit: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('AreaUseCases.getById', () => {
  it('returns area when found', async () => {
    const result = await new AreaUseCases(makeRepo()).getById('area-1')
    expect(result.id).toBe('area-1')
  })
  it('throws AreaNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AreaUseCases(repo).getById('unknown')).rejects.toThrow(AreaNotFoundError)
  })
})

describe('AreaUseCases.create', () => {
  it('creates an area', async () => {
    const repo = makeRepo()
    const input = { name: 'Stade Nord', address: '1 rue du Stade', city: 'Paris', longitude: 2.3522, latitude: 48.8566 }
    await new AreaUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('AreaUseCases.update', () => {
  it('updates area when found', async () => {
    const repo = makeRepo()
    const result = await new AreaUseCases(repo).update('area-1', { city: 'Lyon' })
    expect(result.city).toBe('Lyon')
  })
  it('throws AreaNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AreaUseCases(repo).update('unknown', { city: 'Lyon' })).rejects.toThrow(AreaNotFoundError)
  })
})

describe('AreaUseCases.delete', () => {
  it('deletes area when found', async () => {
    const repo = makeRepo()
    await new AreaUseCases(repo).delete('area-1')
    expect(repo.delete).toHaveBeenCalledWith('area-1')
  })
  it('throws AreaNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AreaUseCases(repo).delete('unknown')).rejects.toThrow(AreaNotFoundError)
  })
})
