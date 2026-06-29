import { describe, it, expect, vi } from 'vitest'
import { AgeCategoryUseCases } from './AgeCategoryUseCases.js'
import type { IAgeCategoryRepository } from '../ports/IAgeCategoryRepository.js'
import { AgeCategoryNotFoundError } from '../domain/AgeCategoryErrors.js'
import { Genre } from '../domain/AgeCategory.js'

const mockAgeCategory = {
  id: 'age-category-1',
  label: 'U13',
  genre: Genre.MALE,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const makeRepo = (overrides: Partial<IAgeCategoryRepository> = {}): IAgeCategoryRepository => ({
  count: vi.fn().mockResolvedValue(1),
  findAll: vi.fn().mockResolvedValue([mockAgeCategory]),
  findById: vi.fn().mockResolvedValue(mockAgeCategory),
  create: vi.fn().mockResolvedValue(mockAgeCategory),
  update: vi.fn().mockResolvedValue({ ...mockAgeCategory, label: 'U15' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('AgeCategoryUseCases.count', () => {
  it('returns the count', async () => {
    expect(await new AgeCategoryUseCases(makeRepo()).count()).toBe(1)
  })
})

describe('AgeCategoryUseCases.getAll', () => {
  it('returns paginated list', async () => {
    const result = await new AgeCategoryUseCases(makeRepo()).getAll({ page: 1, count: 20 })
    expect(result).toHaveLength(1)
  })
})

describe('AgeCategoryUseCases.getById', () => {
  it('returns age category when found', async () => {
    const result = await new AgeCategoryUseCases(makeRepo()).getById('age-category-1')
    expect(result.id).toBe('age-category-1')
  })
  it('throws AgeCategoryNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AgeCategoryUseCases(repo).getById('unknown')).rejects.toThrow(AgeCategoryNotFoundError)
  })
})

describe('AgeCategoryUseCases.create', () => {
  it('creates an age category', async () => {
    const repo = makeRepo()
    const input = { label: 'U13', genre: Genre.MALE }
    await new AgeCategoryUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('AgeCategoryUseCases.update', () => {
  it('updates age category when found', async () => {
    const repo = makeRepo()
    const result = await new AgeCategoryUseCases(repo).update('age-category-1', { label: 'U15' })
    expect(result.label).toBe('U15')
  })
  it('throws AgeCategoryNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AgeCategoryUseCases(repo).update('unknown', { label: 'X' })).rejects.toThrow(
      AgeCategoryNotFoundError
    )
  })
})

describe('AgeCategoryUseCases.delete', () => {
  it('deletes age category when found', async () => {
    const repo = makeRepo()
    await new AgeCategoryUseCases(repo).delete('age-category-1')
    expect(repo.delete).toHaveBeenCalledWith('age-category-1')
  })
  it('throws AgeCategoryNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new AgeCategoryUseCases(repo).delete('unknown')).rejects.toThrow(AgeCategoryNotFoundError)
  })
})
