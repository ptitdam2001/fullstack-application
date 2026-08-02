import { describe, it, expect, vi } from 'vitest'
import { BracketUseCases } from './BracketUseCases.js'
import type { IBracketRepository } from '../ports/IBracketRepository.js'
import type { IMatchRepository } from '../../match/ports/IMatchRepository.js'
import { BracketNotFoundError, BracketLockedError } from '../domain/BracketErrors.js'
import { MatchStatus } from '../../match/domain/Match.js'
import type { Match } from '../../match/domain/Match.js'

const mockBracket = {
  id: 'bracket-1',
  phaseId: 'phase-1',
  name: 'Tableau final',
  bracketTeams: [
    { teamId: 'team-1', round: 1, seed: 1 },
    { teamId: 'team-2', round: 1, seed: 2 },
    { teamId: 'team-3', round: 1, seed: 3 },
    { teamId: 'team-4', round: 1, seed: 4 },
  ],
  updatedAt: new Date('2024-01-01'),
}

const makeRepo = (overrides: Partial<IBracketRepository> = {}): IBracketRepository => ({
  findById: vi.fn().mockResolvedValue(mockBracket),
  create: vi.fn().mockResolvedValue(mockBracket),
  hasPlayedMatches: vi.fn().mockResolvedValue(false),
  ...overrides,
})

const makeMatchRepo = (overrides: Partial<IMatchRepository> = {}): IMatchRepository => ({
  count: vi.fn().mockResolvedValue(0),
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(null),
  findByGroupId: vi.fn().mockResolvedValue([]),
  findByBracketId: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockImplementation((input) => Promise.resolve({ id: 'match-new', updatedAt: new Date(), ...input })),
  update: vi.fn().mockImplementation((id, input) => Promise.resolve({ id, ...input })),
  delete: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const baseMatch: Match = {
  id: 'match-1',
  groupId: null,
  bracketId: 'bracket-1',
  round: 1,
  bracketPosition: 1,
  status: MatchStatus.PLAYED,
  scheduledAt: null,
  area: null,
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeGoals: 2,
  awayGoals: 1,
  forfeitedBy: null,
  updatedAt: new Date(),
}

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
    await new BracketUseCases(repo, makeMatchRepo()).create(input)
    expect(repo.create).toHaveBeenCalledWith(input)
  })
})

describe('BracketUseCases.getById', () => {
  it('throws BracketNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new BracketUseCases(repo, makeMatchRepo()).getById('unknown')).rejects.toThrow(BracketNotFoundError)
  })
})

describe('BracketUseCases.generateMatches', () => {
  it('throws BracketNotFoundError when not found', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new BracketUseCases(repo, makeMatchRepo()).generateMatches('unknown')).rejects.toThrow(
      BracketNotFoundError
    )
  })

  it('throws BracketLockedError when a match already has a score', async () => {
    const repo = makeRepo({ hasPlayedMatches: vi.fn().mockResolvedValue(true) })
    await expect(new BracketUseCases(repo, makeMatchRepo()).generateMatches('bracket-1')).rejects.toThrow(
      BracketLockedError
    )
  })

  it('deletes existing matches then creates the generated plan', async () => {
    const matchRepo = makeMatchRepo({
      findByBracketId: vi.fn().mockResolvedValue([{ ...baseMatch, id: 'stale-match' }]),
    })
    const result = await new BracketUseCases(makeRepo(), matchRepo).generateMatches('bracket-1')
    expect(matchRepo.delete).toHaveBeenCalledWith('stale-match')
    expect(result).toHaveLength(3) // 2 round-1 matches + 1 round-2 final placeholder
    expect(matchRepo.create).toHaveBeenCalledTimes(3)
  })
})

describe('BracketUseCases.advanceWinner', () => {
  it('does nothing when the match has no bracketId', async () => {
    const matchRepo = makeMatchRepo()
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner({ ...baseMatch, bracketId: null })
    expect(matchRepo.update).not.toHaveBeenCalled()
  })

  it('does nothing when the match is still SCHEDULED', async () => {
    const matchRepo = makeMatchRepo()
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner({ ...baseMatch, status: MatchStatus.SCHEDULED })
    expect(matchRepo.update).not.toHaveBeenCalled()
  })

  it('does nothing when there is no next round match yet', async () => {
    const matchRepo = makeMatchRepo({ findByBracketId: vi.fn().mockResolvedValue([baseMatch]) })
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner(baseMatch)
    expect(matchRepo.update).not.toHaveBeenCalled()
  })

  it('advances the winner into the home slot of an odd-position match', async () => {
    const nextMatch = { ...baseMatch, id: 'match-round2', round: 2, bracketPosition: 1, homeTeamId: null, awayTeamId: null }
    const matchRepo = makeMatchRepo({ findByBracketId: vi.fn().mockResolvedValue([baseMatch, nextMatch]) })
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner(baseMatch)
    expect(matchRepo.update).toHaveBeenCalledWith('match-round2', { homeTeamId: 'team-1' })
  })

  it('advances the winner into the away slot of an even-position match', async () => {
    const evenMatch = { ...baseMatch, bracketPosition: 2 }
    const nextMatch = { ...baseMatch, id: 'match-round2', round: 2, bracketPosition: 1, homeTeamId: null, awayTeamId: null }
    const matchRepo = makeMatchRepo({ findByBracketId: vi.fn().mockResolvedValue([evenMatch, nextMatch]) })
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner(evenMatch)
    expect(matchRepo.update).toHaveBeenCalledWith('match-round2', { awayTeamId: 'team-1' })
  })

  it('advances the non-forfeiting team on a FORFEITED match', async () => {
    const forfeited = { ...baseMatch, status: MatchStatus.FORFEITED, forfeitedBy: 'team-1', homeGoals: null, awayGoals: null }
    const nextMatch = { ...baseMatch, id: 'match-round2', round: 2, bracketPosition: 1, homeTeamId: null, awayTeamId: null }
    const matchRepo = makeMatchRepo({ findByBracketId: vi.fn().mockResolvedValue([forfeited, nextMatch]) })
    await new BracketUseCases(makeRepo(), matchRepo).advanceWinner(forfeited)
    expect(matchRepo.update).toHaveBeenCalledWith('match-round2', { homeTeamId: 'team-2' })
  })
})
