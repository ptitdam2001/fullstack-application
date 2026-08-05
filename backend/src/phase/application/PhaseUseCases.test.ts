import { describe, it, expect, vi } from 'vitest'
import { PhaseUseCases } from './PhaseUseCases.js'
import type { IPhaseRepository } from '../ports/IPhaseRepository.js'
import { PhaseNotFoundError, PhaseDuplicateOrderError, PreviousPhaseNotFinishedError } from '../domain/PhaseErrors.js'
import { PhaseType } from '../domain/Phase.js'

const mockPhase = {
  id: 'phase-1',
  championshipId: 'champ-1',
  type: PhaseType.GROUP,
  order: 1,
  name: 'Phase de poules',
  qualification: null,
}

const makeRepo = (overrides: Partial<IPhaseRepository> = {}): IPhaseRepository => ({
  findByChampionshipId: vi.fn().mockResolvedValue([mockPhase]),
  findById: vi.fn().mockResolvedValue(mockPhase),
  create: vi.fn().mockResolvedValue(mockPhase),
  update: vi.fn().mockResolvedValue({ ...mockPhase, name: 'Phase 1 modifiée' }),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  isFinished: vi.fn().mockResolvedValue(true),
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
    const input = { championshipId: 'champ-1', type: PhaseType.GROUP, order: 2, name: 'Phase éliminatoire', qualification: null }
    await new PhaseUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })

  it('throws PhaseDuplicateOrderError when order already exists in championship', async () => {
    const repo = makeRepo()
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 1, name: 'Phase éliminatoire', qualification: null }
    await expect(new PhaseUseCases(repo).create(input)).rejects.toThrow(PhaseDuplicateOrderError)
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('allows same order in different championships', async () => {
    const repo = makeRepo({ findByChampionshipId: vi.fn().mockResolvedValue([]) })
    const input = { championshipId: 'champ-2', type: PhaseType.GROUP, order: 1, name: 'Phase de poules', qualification: null }
    await new PhaseUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })

  it('creates order > 1 when previous phase is finished', async () => {
    const repo = makeRepo({ isFinished: vi.fn().mockResolvedValue(true) })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 2, name: 'Phase finale', qualification: null }
    await new PhaseUseCases(repo).create(input)
    expect(repo.isFinished).toHaveBeenCalledWith('phase-1')
    expect(repo.create).toHaveBeenCalledWith(input)
  })

  it('throws PreviousPhaseNotFinishedError when previous phase is not finished', async () => {
    const repo = makeRepo({ isFinished: vi.fn().mockResolvedValue(false) })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 2, name: 'Phase finale', qualification: null }
    await expect(new PhaseUseCases(repo).create(input)).rejects.toThrow(PreviousPhaseNotFinishedError)
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('throws PreviousPhaseNotFinishedError when previous phase does not exist', async () => {
    const repo = makeRepo({ findByChampionshipId: vi.fn().mockResolvedValue([]) })
    const input = { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 3, name: 'Phase finale', qualification: null }
    await expect(new PhaseUseCases(repo).create(input)).rejects.toThrow(PreviousPhaseNotFinishedError)
    expect(repo.create).not.toHaveBeenCalled()
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
  it('hard deletes when no played matches', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(false) })
    await new PhaseUseCases(repo).delete('phase-1')
    expect(repo.delete).toHaveBeenCalledWith('phase-1')
    expect(repo.softDelete).not.toHaveBeenCalled()
  })
  it('soft deletes when played matches exist', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    await new PhaseUseCases(repo).delete('phase-1')
    expect(repo.softDelete).toHaveBeenCalledWith('phase-1')
    expect(repo.delete).not.toHaveBeenCalled()
  })
  it('throws PhaseNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PhaseUseCases(repo).delete('unknown')).rejects.toThrow(PhaseNotFoundError)
  })
})
