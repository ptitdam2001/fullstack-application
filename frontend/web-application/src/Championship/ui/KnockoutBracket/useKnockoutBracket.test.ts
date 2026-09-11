import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKnockoutBracket } from './useKnockoutBracket'
import { MatchStatus } from '../../domain/Match'
import type { Match } from '../../domain/Match'

const match = (overrides: Partial<Match>): Match => ({
  id: overrides.id ?? 'm',
  area: null,
  homeTeamId: null,
  awayTeamId: null,
  status: MatchStatus.SCHEDULED,
  bracketId: 'b1',
  ...overrides,
})

describe('useKnockoutBracket', () => {
  it('reports hasBracket false when there are no bracket matches', () => {
    const { result } = renderHook(() => useKnockoutBracket([match({ bracketId: null, groupId: 'g' })]))
    expect(result.current.hasBracket).toBe(false)
    expect(result.current.rounds).toEqual([])
  })

  it('reports hasBracket true and groups matches into rounds', () => {
    const matches = [
      match({ id: 'sf1', round: 1, bracketPosition: 1 }),
      match({ id: 'sf2', round: 1, bracketPosition: 2 }),
      match({ id: 'final', round: 2, bracketPosition: 1 }),
    ]
    const { result } = renderHook(() => useKnockoutBracket(matches))
    expect(result.current.hasBracket).toBe(true)
    expect(result.current.rounds.map(round => round.map(m => m.id))).toEqual([['sf1', 'sf2'], ['final']])
  })
})
