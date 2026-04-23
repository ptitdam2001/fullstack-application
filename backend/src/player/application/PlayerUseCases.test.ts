import { describe, it, expect, vi } from 'vitest'
import { PlayerUseCases } from './PlayerUseCases.js'
import type { IPlayerRepository } from '../ports/IPlayerRepository.js'
import { PlayerNotFoundError } from '../domain/PlayerErrors.js'

const mockPlayer = {
  id: 'player-1',
  userId: 'user-1',
  teamId: 'team-1',
  jersey: 10,
  position: 'forward',
  lastname: 'Dupont',
  firstname: 'Jules',
  avatar: null,
}

const makeRepo = (overrides: Partial<IPlayerRepository> = {}): IPlayerRepository => ({
  findById: vi.fn().mockResolvedValue(mockPlayer),
  findByUserId: vi.fn().mockResolvedValue(mockPlayer),
  create: vi.fn().mockResolvedValue(mockPlayer),
  update: vi.fn().mockResolvedValue(mockPlayer),
  assignToTeam: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('PlayerUseCases.create', () => {
  it('creates a player profile', async () => {
    const repo = makeRepo()
    const useCases = new PlayerUseCases(repo)
    const input = { userId: 'user-1', teamId: 'team-1', jersey: 10, position: 'forward', lastname: 'Dupont', firstname: 'Jules', avatar: null }
    await useCases.create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('PlayerUseCases.assignToTeam', () => {
  it('assigns player to a team when player exists', async () => {
    const repo = makeRepo()
    const useCases = new PlayerUseCases(repo)
    await useCases.assignToTeam('user-1', 'team-2')
    expect(repo.assignToTeam).toHaveBeenCalledWith('user-1', 'team-2')
  })

  it('throws PlayerNotFoundError when player profile does not exist', async () => {
    const repo = makeRepo({ findByUserId: vi.fn().mockResolvedValue(null) })
    const useCases = new PlayerUseCases(repo)
    await expect(useCases.assignToTeam('unknown-user', 'team-1')).rejects.toThrow(PlayerNotFoundError)
  })
})
