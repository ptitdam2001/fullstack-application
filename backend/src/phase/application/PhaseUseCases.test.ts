import { describe, it, expect, vi } from 'vitest'
import { PhaseUseCases } from './PhaseUseCases.js'
import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import { PhaseNotFoundError } from '../domain/PhaseErrors.js'
import { PhaseType } from '../domain/Phase.js'

const mockPhase = {
  id: 'phase-1',
  championshipId: 'champ-1',
  type: PhaseType.GROUP,
  order: 1,
  name: 'Phase de poules',
}

const makeRepo = (overrides: Partial<IPhaseRepository> = {}): IPhaseRepository => ({
  findByChampionshipId: vi.fn().mockResolvedValue([mockPhase]),
  findById: vi.fn().mockResolvedValue(mockPhase),
  create: vi.fn().mockResolvedValue(mockPhase),
  update: vi.fn().mockResolvedValue({ ...mockPhase, name: 'Phase 1 modifiée' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('PhaseUseCases.getByChampionshipId', () => {
  it('returns phases for the championship', async () => {
    const result = await new PhaseUseCases(makeRepo()).getByChampionshipId('champ-1')
    expect(result).toHaveLength(1)
    expect(result[0].championshipId).toBe('champ-1')
  })
})

describe('PhaseUseCases.getById', () => {
  it('returns phase when found', async () => {
    const result = await new PhaseUseCases(makeRepo()).getById('phase-1')
    expect(result.id).toBe('phase-1')
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PhaseUseCases(repo).getById('unknown')).rejects.toThrow(PhaseNotFoundError)
  })
})

describe('PhaseUseCases.create', () => {
  it('creates a phase', async () => {
    const repo = makeRepo()
    const input = { championshipId: 'champ-1', type: PhaseType.GROUP, order: 1, name: 'Phase de poules' }
    await new PhaseUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('PhaseUseCases.update', () => {
  it('updates phase when found', async () => {
    const result = await new PhaseUseCases(makeRepo()).update('phase-1', { name: 'Phase 1 modifiée' })
    expect(result.name).toBe('Phase 1 modifiée')
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PhaseUseCases(repo).update('unknown', {})).rejects.toThrow(PhaseNotFoundError)
  })
})

describe('PhaseUseCases.delete', () => {
  it('deletes phase when found', async () => {
    const repo = makeRepo()
    await new PhaseUseCases(repo).delete('phase-1')
    expect(repo.delete).toHaveBeenCalledWith('phase-1')
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PhaseUseCases(repo).delete('unknown')).rejects.toThrow(PhaseNotFoundError)
  })
})
