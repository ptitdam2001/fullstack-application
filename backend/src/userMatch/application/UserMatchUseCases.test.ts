import { describe, it, expect, vi } from 'vitest'
import { UserMatchUseCases } from './UserMatchUseCases.js'
import type { IUserMatchRepository } from '../ports/IUserMatchRepository.js'
import { UserMatchNotFoundError, UserMatchAlreadyExistsError } from '../domain/UserMatchErrors.js'

const mockUserMatch = { id: 'um-1', userId: 'user-1', matchId: 'match-1' }

const makeRepo = (overrides: Partial<IUserMatchRepository> = {}): IUserMatchRepository => ({
  assign: vi.fn().mockResolvedValue(mockUserMatch),
  remove: vi.fn().mockResolvedValue(undefined),
  findByMatch: vi.fn().mockResolvedValue([mockUserMatch]),
  findByUser: vi.fn().mockResolvedValue([mockUserMatch]),
  isReferee: vi.fn().mockResolvedValue(false),
  ...overrides,
})

describe('UserMatchUseCases.assign', () => {
  it('assigns a referee to a match', async () => {
    const repo = makeRepo()
    const result = await new UserMatchUseCases(repo).assign('user-1', 'match-1')
    expect(result).toEqual(mockUserMatch)
    expect(repo.assign).toHaveBeenCalledWith('user-1', 'match-1')
  })

  it('throws UserMatchAlreadyExistsError when already assigned', async () => {
    const repo = makeRepo({ isReferee: vi.fn().mockResolvedValue(true) })
    await expect(new UserMatchUseCases(repo).assign('user-1', 'match-1')).rejects.toThrow(UserMatchAlreadyExistsError)
  })
})

describe('UserMatchUseCases.remove', () => {
  it('removes a referee from a match', async () => {
    const repo = makeRepo({ isReferee: vi.fn().mockResolvedValue(true) })
    await new UserMatchUseCases(repo).remove('user-1', 'match-1')
    expect(repo.remove).toHaveBeenCalledWith('user-1', 'match-1')
  })

  it('throws UserMatchNotFoundError when not assigned', async () => {
    const repo = makeRepo({ isReferee: vi.fn().mockResolvedValue(false) })
    await expect(new UserMatchUseCases(repo).remove('user-1', 'match-1')).rejects.toThrow(UserMatchNotFoundError)
  })
})

describe('UserMatchUseCases.getMatchReferees', () => {
  it('returns referees for a match', async () => {
    const result = await new UserMatchUseCases(makeRepo()).getMatchReferees('match-1')
    expect(result).toHaveLength(1)
    expect(result[0].matchId).toBe('match-1')
  })
})

describe('UserMatchUseCases.getUserMatches', () => {
  it('returns matches for a referee', async () => {
    const result = await new UserMatchUseCases(makeRepo()).getUserMatches('user-1')
    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })
})
