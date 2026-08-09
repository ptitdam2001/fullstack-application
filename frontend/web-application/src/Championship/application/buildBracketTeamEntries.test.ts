import { describe, it, expect } from 'vitest'
import { buildBracketTeamEntries } from './buildBracketTeamEntries'

describe('buildBracketTeamEntries', () => {
  it('assigns round 1 to every team when the count is a power of 2 (2 teams)', () => {
    expect(buildBracketTeamEntries(['t1', 't2'])).toEqual([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
    ])
  })

  it('assigns round 1 to every team when the count is a power of 2 (4 teams)', () => {
    expect(buildBracketTeamEntries(['t1', 't2', 't3', 't4'])).toEqual([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
      { teamId: 't3', round: 1, seed: 3 },
      { teamId: 't4', round: 1, seed: 4 },
    ])
  })

  it('pushes the trailing odd team out to the round where it first plays (3 teams)', () => {
    expect(buildBracketTeamEntries(['t1', 't2', 't3'])).toEqual([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
      { teamId: 't3', round: 2, seed: 3 },
    ])
  })

  it('chains a bye across consecutive rounds until a real match happens (5 teams)', () => {
    expect(buildBracketTeamEntries(['t1', 't2', 't3', 't4', 't5'])).toEqual([
      { teamId: 't1', round: 1, seed: 1 },
      { teamId: 't2', round: 1, seed: 2 },
      { teamId: 't3', round: 1, seed: 3 },
      { teamId: 't4', round: 1, seed: 4 },
      { teamId: 't5', round: 3, seed: 5 },
    ])
  })

  it('returns no entries for fewer than 2 teams', () => {
    expect(buildBracketTeamEntries([])).toEqual([])
    expect(buildBracketTeamEntries(['t1'])).toEqual([])
  })
})
