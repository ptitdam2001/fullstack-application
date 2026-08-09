import { describe, it, expect } from 'vitest'
import { roundRobin } from './roundRobin'
import { MatchMode } from '../domain/Group'

function opponentsOf(teamId: string, pairs: { homeTeamId: string; awayTeamId: string }[]): string[] {
  return pairs
    .filter(p => p.homeTeamId === teamId || p.awayTeamId === teamId)
    .map(p => (p.homeTeamId === teamId ? p.awayTeamId : p.homeTeamId))
}

describe('roundRobin', () => {
  it('returns no matches for fewer than 2 teams', () => {
    expect(roundRobin([], MatchMode.SINGLE)).toEqual([])
    expect(roundRobin(['t1'], MatchMode.SINGLE)).toEqual([])
  })

  it('pairs every team with every other team exactly once (SINGLE, even count)', () => {
    const teamIds = ['t1', 't2', 't3', 't4']
    const pairs = roundRobin(teamIds, MatchMode.SINGLE)
    expect(pairs).toHaveLength(6)
    for (const teamId of teamIds) {
      expect(opponentsOf(teamId, pairs).sort()).toEqual(teamIds.filter(t => t !== teamId).sort())
    }
  })

  it('pairs every team with every other team exactly once (SINGLE, odd count via bye)', () => {
    const teamIds = ['t1', 't2', 't3']
    const pairs = roundRobin(teamIds, MatchMode.SINGLE)
    expect(pairs).toHaveLength(3)
    for (const teamId of teamIds) {
      expect(opponentsOf(teamId, pairs).sort()).toEqual(teamIds.filter(t => t !== teamId).sort())
    }
  })

  it('never pairs a team against itself and never involves a bye', () => {
    const pairs = roundRobin(['t1', 't2', 't3', 't4', 't5'], MatchMode.SINGLE)
    for (const pair of pairs) {
      expect(pair.homeTeamId).not.toBe(pair.awayTeamId)
      expect(['t1', 't2', 't3', 't4', 't5']).toContain(pair.homeTeamId)
      expect(['t1', 't2', 't3', 't4', 't5']).toContain(pair.awayTeamId)
    }
  })

  it('doubles matches with both home and away legs for HOME_AND_AWAY', () => {
    const teamIds = ['t1', 't2', 't3', 't4']
    const pairs = roundRobin(teamIds, MatchMode.HOME_AND_AWAY)
    expect(pairs).toHaveLength(12)
    for (const teamId of teamIds) {
      const opponents = opponentsOf(teamId, pairs).sort()
      const expected = [...teamIds.filter(t => t !== teamId), ...teamIds.filter(t => t !== teamId)].sort()
      expect(opponents).toEqual(expected)
    }
  })
})
