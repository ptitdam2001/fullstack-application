import { describe, it, expect } from 'vitest'
import { buildBracket } from './buildBracket'

describe('buildBracket', () => {
  it('returns a single final match for 2 teams, no connectors', () => {
    const { rounds, connectors } = buildBracket(['t1', 't2'])
    expect(rounds).toHaveLength(1)
    expect(rounds[0]).toEqual([{ a: { teamId: 't1', origin: null }, b: { teamId: 't2', origin: null } }])
    expect(connectors).toEqual([])
  })

  it('gives the last team a bye when the round is odd (3 teams)', () => {
    const { rounds } = buildBracket(['t1', 't2', 't3'])
    expect(rounds).toHaveLength(2)
    expect(rounds[0]).toEqual([
      { a: { teamId: 't1', origin: null }, b: { teamId: 't2', origin: null } },
      { a: { teamId: 't3', origin: null }, b: null },
    ])
    // round 2 final: winner of match 0 vs t3 (direct qualifier via bye)
    expect(rounds[1][0].b).toEqual({ teamId: 't3', origin: { fromRound: 0, fromMatch: 1 } })
    expect(rounds[1][0].a.teamId).toBeNull()
  })

  it('produces two full rounds for 4 teams with a connector into the final', () => {
    const { rounds, connectors } = buildBracket(['t1', 't2', 't3', 't4'])
    expect(rounds).toHaveLength(2)
    expect(rounds[0]).toHaveLength(2)
    expect(rounds[1]).toHaveLength(1)
    expect(connectors).toHaveLength(2)
    expect(connectors).toContainEqual({ fromRound: 0, fromMatch: 0, toRound: 1, toMatch: 0 })
    expect(connectors).toContainEqual({ fromRound: 0, fromMatch: 1, toRound: 1, toMatch: 0 })
  })

  it('chains byes across rounds for an odd count that stays odd after halving (5 teams)', () => {
    const { rounds } = buildBracket(['t1', 't2', 't3', 't4', 't5'])
    // round 1: (t1,t2) (t3,t4) bye(t5) -> 3 entrants into round 2
    // round 2: (w1,w2) bye(t5) -> 2 entrants into round 3 (final)
    expect(rounds).toHaveLength(3)
    expect(rounds[0]).toHaveLength(3)
    expect(rounds[1]).toHaveLength(2)
    expect(rounds[2]).toHaveLength(1)
    expect(rounds[0][2]).toEqual({ a: { teamId: 't5', origin: null }, b: null })
    expect(rounds[1][1]).toEqual({ a: { teamId: 't5', origin: { fromRound: 0, fromMatch: 2 } }, b: null })
    expect(rounds[2][0].b).toEqual({ teamId: 't5', origin: { fromRound: 1, fromMatch: 1 } })
  })

  it('returns no rounds for fewer than 2 teams', () => {
    expect(buildBracket([]).rounds).toEqual([])
    expect(buildBracket(['t1']).rounds).toEqual([])
  })
})
