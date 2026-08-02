import { describe, it, expect } from 'vitest'
import { buildBracketMatches } from './buildBracketMatches.js'
import { BracketInvalidShapeError } from '../domain/BracketErrors.js'

describe('buildBracketMatches', () => {
  it('throws when round 1 is empty', () => {
    expect(() => buildBracketMatches([])).toThrow(BracketInvalidShapeError)
  })

  it('throws when round 1 has an odd number of teams', () => {
    expect(() =>
      buildBracketMatches([
        { teamId: 't1', round: 1, seed: 1 },
        { teamId: 't2', round: 1, seed: 2 },
        { teamId: 't3', round: 1, seed: 3 },
      ])
    ).toThrow(BracketInvalidShapeError)
  })

  it('pairs a 4-team round 1 bracket into round 1 matches + a round 2 final placeholder', () => {
    const plans = buildBracketMatches([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
      { teamId: 't3', round: 1, seed: 3 },
      { teamId: 't4', round: 1, seed: 4 },
    ])
    expect(plans).toEqual([
      { round: 1, bracketPosition: 1, homeTeamId: 't1', awayTeamId: 't2' },
      { round: 1, bracketPosition: 2, homeTeamId: 't3', awayTeamId: 't4' },
      { round: 2, bracketPosition: 1, homeTeamId: null, awayTeamId: null },
    ])
  })

  it('orders round 1 pairs by seed regardless of input order', () => {
    const plans = buildBracketMatches([
      { teamId: 't4', round: 1, seed: 4 },
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't3', round: 1, seed: 3 },
      { teamId: 't2', round: 1, seed: 2 },
    ])
    expect(plans[0]).toEqual({ round: 1, bracketPosition: 1, homeTeamId: 't1', awayTeamId: 't2' })
    expect(plans[1]).toEqual({ round: 1, bracketPosition: 2, homeTeamId: 't3', awayTeamId: 't4' })
  })

  it('generates 3 rounds for an 8-team bracket with no byes', () => {
    const bracketTeams = Array.from({ length: 8 }, (_, i) => ({ teamId: `t${i + 1}`, round: 1, seed: i + 1 }))
    const plans = buildBracketMatches(bracketTeams)
    const round1 = plans.filter((p) => p.round === 1)
    const round2 = plans.filter((p) => p.round === 2)
    const round3 = plans.filter((p) => p.round === 3)
    expect(round1).toHaveLength(4)
    expect(round2).toHaveLength(2)
    expect(round3).toHaveLength(1)
    expect(round1.every((m) => m.homeTeamId !== null && m.awayTeamId !== null)).toBe(true)
    expect(round2.every((m) => m.homeTeamId === null && m.awayTeamId === null)).toBe(true)
    expect(round3[0]).toEqual({ round: 3, bracketPosition: 1, homeTeamId: null, awayTeamId: null })
  })

  it('places a round-2 bye into the round 2 slot after the round 1 winner slot', () => {
    // 2 round-1 teams (1 match, 1 winner slot) + 1 bye entering at round 2 -> round2 has 2 slots (1 winner + 1 bye) -> 1 match
    const plans = buildBracketMatches([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
      { teamId: 'bye', round: 2, seed: 1 },
    ])
    expect(plans).toEqual([
      { round: 1, bracketPosition: 1, homeTeamId: 't1', awayTeamId: 't2' },
      { round: 2, bracketPosition: 1, homeTeamId: null, awayTeamId: 'bye' },
    ])
  })

  it('throws when an intermediate round ends up with an odd slot count', () => {
    // 4 round-1 teams (2 matches -> 2 winner slots) + 1 lone bye at round 2 -> 3 slots, odd
    expect(() =>
      buildBracketMatches([
        { teamId: 't1', round: 1, seed: 1 },
        { teamId: 't2', round: 1, seed: 2 },
        { teamId: 't3', round: 1, seed: 3 },
        { teamId: 't4', round: 1, seed: 4 },
        { teamId: 'bye', round: 2, seed: 1 },
      ])
    ).toThrow(BracketInvalidShapeError)
  })
})
