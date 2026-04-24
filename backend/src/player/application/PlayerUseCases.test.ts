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
}

const makeRepo = (overrides: Partial<IPlayerRepository> = {}): IPlayerRepository => ({
  findById: vi.fn().mockResolvedValue(mockPlayer),
  findByUserAndTeam: vi.fn().mockResolvedValue(mockPlayer),
  findByUserId: vi.fn().mockResolvedValue([mockPlayer]),
  create: vi.fn().mockResolvedValue(mockPlayer),
  update: vi.fn().mockResolvedValue({ ...mockPlayer, jersey: 99 }),
  delete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('PlayerUseCases.create', () => {
  it('creates a player profile', async () => {
    const repo = makeRepo()
    const input = { userId: 'user-1', teamId: 'team-1', jersey: 10, position: 'forward' }
    await new PlayerUseCases(repo).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('PlayerUseCases.update', () => {
  it('updates player when found', async () => {
    const result = await new PlayerUseCases(makeRepo()).update('player-1', { jersey: 99 })
    expect(result.jersey).toBe(99)
  })

  it('throws PlayerNotFoundError when player does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PlayerUseCases(repo).update('unknown', { jersey: 1 })).rejects.toThrow(PlayerNotFoundError)
  })
})

describe('PlayerUseCases.delete', () => {
  it('deletes player when found', async () => {
    const repo = makeRepo()
    await new PlayerUseCases(repo).delete('player-1')
    expect(repo.delete).toHaveBeenCalledWith('player-1')
  })

  it('throws PlayerNotFoundError when player does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new PlayerUseCases(repo).delete('unknown')).rejects.toThrow(PlayerNotFoundError)
  })
})
