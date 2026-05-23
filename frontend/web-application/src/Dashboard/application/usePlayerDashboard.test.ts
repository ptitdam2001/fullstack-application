import { describe, expect, it } from 'vitest'
import type { Match } from '@Sdk/model/match'
import { filterUpcomingMatches } from './usePlayerDashboard'

const makeMatch = (overrides: Partial<Match> & { id: string }): Match => ({
  id: overrides.id,
  area: { name: 'Terrain A' },
  homeTeamId: 'home-1',
  awayTeamId: 'away-1',
  status: 'SCHEDULED',
  ...overrides,
})

const NOW = new Date('2025-06-01T12:00:00Z')
const FUTURE = '2025-06-10T10:00:00Z'
const PAST = '2025-05-01T10:00:00Z'

describe('filterUpcomingMatches', () => {
  it('returns empty array when no matches', () => {
    expect(filterUpcomingMatches([], NOW)).toEqual([])
  })

  it('excludes past matches', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: PAST })
    expect(filterUpcomingMatches([m], NOW)).toHaveLength(0)
  })

  it('includes future scheduled matches', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: FUTURE })
    expect(filterUpcomingMatches([m], NOW)).toHaveLength(1)
  })

  it('excludes non-SCHEDULED matches even if in the future', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: FUTURE, status: 'PLAYED' })
    expect(filterUpcomingMatches([m], NOW)).toHaveLength(0)
  })

  it('excludes matches with no scheduledAt', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: null })
    expect(filterUpcomingMatches([m], NOW)).toHaveLength(0)
  })

  it('sorts by scheduledAt ascending', () => {
    const near = makeMatch({ id: 'near', scheduledAt: '2025-06-05T10:00:00Z' })
    const far = makeMatch({ id: 'far', scheduledAt: '2025-06-20T10:00:00Z' })
    const result = filterUpcomingMatches([far, near], NOW)
    expect(result[0].id).toBe('near')
    expect(result[1].id).toBe('far')
  })
})