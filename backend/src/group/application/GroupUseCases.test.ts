import { describe, it, expect, vi } from 'vitest'
import { GroupUseCases } from './GroupUseCases.js'
import type { IGroupRepository } from '../ports/IGroupRepository.js'
import { GroupNotFoundError } from '../domain/GroupErrors.js'
import { MatchMode } from '../domain/Group.js'

const mockGroup = {
  id: 'group-1',
  phaseId: 'phase-1',
  name: 'Poule A',
  matchMode: MatchMode.HOME_AND_AWAY,
  teamIds: ['team-1', 'team-2', 'team-3'],
}

const makeRepo = (overrides: Partial<IGroupRepository> = {}): IGroupRepository => ({
  findByPhaseId: vi.fn().mockResolvedValue([mockGroup]),
  findById: vi.fn().mockResolvedValue(mockGroup),
  create: vi.fn().mockResolvedValue(mockGroup),
  update: vi.fn().mockResolvedValue({ ...mockGroup, name: 'Poule B' }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('GroupUseCases.getByPhaseId', () => {
  it('returns groups for the phase', async () => {
    const result = await new GroupUseCases(makeRepo()).getByPhaseId('phase-1')
    expect(result).toHaveLength(1)
    expect(result[0].phaseId).toBe('phase-1')
  })
})

describe('GroupUseCases.getById', () => {
  it('returns group when found', async () => {
    const result = await new GroupUseCases(makeRepo()).getById('group-1')
    expect(result.id).toBe('group-1')
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo).getById('unknown')).rejects.toThrow(GroupNotFoundError)
  })
})

describe('GroupUseCases.create', () => {
  it('creates a group', async () => {
    const repo = makeRepo()
    const input = { phaseId: 'phase-1', name: 'Poule A', matchMode: MatchMode.HOME_AND_AWAY, teamIds: ['team-1', 'team-2'] }
    await new GroupUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('GroupUseCases.update', () => {
  it('updates group when found', async () => {
    const result = await new GroupUseCases(makeRepo()).update('group-1', { name: 'Poule B' })
    expect(result.name).toBe('Poule B')
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo).update('unknown', {})).rejects.toThrow(GroupNotFoundError)
  })
})

describe('GroupUseCases.delete', () => {
  it('deletes group when found', async () => {
    const repo = makeRepo()
    await new GroupUseCases(repo).delete('group-1')
    expect(repo.delete).toHaveBeenCalledWith('group-1')
  })
  it('throws GroupNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new GroupUseCases(repo).delete('unknown')).rejects.toThrow(GroupNotFoundError)
  })
})
