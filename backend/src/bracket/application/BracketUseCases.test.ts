import { describe, it, expect, vi } from 'vitest'
import { BracketUseCases } from './BracketUseCases.js'
import type { IBracketRepository } from '../ports/IBracketRepository.js'

const mockBracket = {
  id: 'bracket-1',
  phaseId: 'phase-1',
  name: 'Tableau final',
  bracketTeams: [
    { teamId: 'team-1', round: 1, seed: 1 },
    { teamId: 'team-2', round: 1, seed: 2 },
  ],
  updatedAt: new Date('2024-01-01'),
}

const makeRepo = (overrides: Partial<IBracketRepository> = {}): IBracketRepository => ({
  create: vi.fn().mockResolvedValue(mockBracket),
  ...overrides,
})

describe('BracketUseCases.create', () => {
  it('creates a bracket', async () => {
    const repo = makeRepo()
    const input = {
      phaseId: 'phase-1',
      name: 'Tableau final',
      bracketTeams: [
        { teamId: 'team-1', round: 1, seed: 1 },
        { teamId: 'team-2', round: 1, seed: 2 },
      ],
    }
    const result = await new BracketUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
    expect(result.id).toBe('bracket-1')
  })
})
