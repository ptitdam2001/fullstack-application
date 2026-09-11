import { describe, expect, it } from 'vitest'
import { buildBracketFromMatches } from './buildBracketFromMatches'
import { MatchStatus } from '../domain/Match'
import type { Match } from '../domain/Match'

const match = (overrides: Partial<Match>): Match => ({
  id: overrides.id ?? 'm',
  area: null,
  homeTeamId: null,
  awayTeamId: null,
  status: MatchStatus.SCHEDULED,
  bracketId: 'b1',
  ...overrides,
})

describe('buildBracketFromMatches', () => {
  it('returns empty rounds and connectors when there are no bracket matches', () => {
    const matches = [match({ id: 'g1', bracketId: null, groupId: 'g' })]
    expect(buildBracketFromMatches(matches)).toEqual({ rounds: [], connectors: [] })
  })

  it('ignores group matches mixed with bracket matches', () => {
    const matches = [
      match({ id: 'g1', bracketId: null, groupId: 'g' }),
      match({ id: 'f1', round: 1, bracketPosition: 1 }),
    ]
    const { rounds } = buildBracketFromMatches(matches)
    expect(rounds).toEqual([[match({ id: 'f1', round: 1, bracketPosition: 1 })]])
  })

  it('sorts matches within a round by bracketPosition', () => {
    const matches = [
      match({ id: 'm2', round: 1, bracketPosition: 2 }),
      match({ id: 'm1', round: 1, bracketPosition: 1 }),
    ]
    const { rounds } = buildBracketFromMatches(matches)
    expect(rounds[0].map(m => m.id)).toEqual(['m1', 'm2'])
  })

  it('groups matches into one array per round, in round order', () => {
    const matches = [
      match({ id: 'final', round: 2, bracketPosition: 1 }),
      match({ id: 'sf1', round: 1, bracketPosition: 1 }),
      match({ id: 'sf2', round: 1, bracketPosition: 2 }),
    ]
    const { rounds } = buildBracketFromMatches(matches)
    expect(rounds.map(round => round.map(m => m.id))).toEqual([['sf1', 'sf2'], ['final']])
  })

  it('connects each round-1 match to the round-2 match at floor(index/2)', () => {
    const matches = [
      match({ id: 'final', round: 2, bracketPosition: 1 }),
      match({ id: 'sf1', round: 1, bracketPosition: 1 }),
      match({ id: 'sf2', round: 1, bracketPosition: 2 }),
    ]
    const { connectors } = buildBracketFromMatches(matches)
    expect(connectors).toEqual([
      { fromRound: 0, fromMatch: 0, toRound: 1, toMatch: 0 },
      { fromRound: 0, fromMatch: 1, toRound: 1, toMatch: 0 },
    ])
  })

  it('produces no connectors for a single-round bracket (final only)', () => {
    const matches = [match({ id: 'final', round: 1, bracketPosition: 1 })]
    const { connectors } = buildBracketFromMatches(matches)
    expect(connectors).toEqual([])
  })
})
