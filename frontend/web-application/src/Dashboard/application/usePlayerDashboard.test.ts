import { describe, expect, it } from 'vitest'
import type { Match } from '@Sdk/model/match'
import { filterUpcomingMatches, filterRecentResults } from './usePlayerDashboard'

const makeMatch = (overrides: Partial<Match> & { id: string }): Match => ({
  area: {
    name: 'Terrain A',
    id: '',
    address: '',
    city: '',
    longitude: 0,
    latitude: 0,
  },
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

const TEAM_ID = 'team-1'

describe('filterRecentResults', () => {
  it('returns empty array when no matches', () => {
    expect(filterRecentResults([], TEAM_ID)).toEqual([])
  })

  it('excludes non-PLAYED matches', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: PAST, status: 'SCHEDULED', homeTeamId: TEAM_ID })
    expect(filterRecentResults([m], TEAM_ID)).toHaveLength(0)
  })

  it('includes PLAYED matches for the team as home', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: PAST, status: 'PLAYED', homeTeamId: TEAM_ID })
    expect(filterRecentResults([m], TEAM_ID)).toHaveLength(1)
  })

  it('includes PLAYED matches for the team as away', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: PAST, status: 'PLAYED', awayTeamId: TEAM_ID })
    expect(filterRecentResults([m], TEAM_ID)).toHaveLength(1)
  })

  it('excludes PLAYED matches for other teams', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: PAST, status: 'PLAYED', homeTeamId: 'other', awayTeamId: 'other2' })
    expect(filterRecentResults([m], TEAM_ID)).toHaveLength(0)
  })

  it('sorts by scheduledAt descending (most recent first)', () => {
    const older = makeMatch({ id: 'older', scheduledAt: '2025-04-01T10:00:00Z', status: 'PLAYED', homeTeamId: TEAM_ID })
    const newer = makeMatch({ id: 'newer', scheduledAt: '2025-05-20T10:00:00Z', status: 'PLAYED', homeTeamId: TEAM_ID })
    const result = filterRecentResults([older, newer], TEAM_ID)
    expect(result[0].id).toBe('newer')
    expect(result[1].id).toBe('older')
  })

  it('limits to 5 results', () => {
    const matches = Array.from({ length: 7 }, (_, i) =>
      makeMatch({ id: `m${i}`, scheduledAt: `2025-04-0${i + 1}T10:00:00Z`, status: 'PLAYED', homeTeamId: TEAM_ID })
    )
    expect(filterRecentResults(matches, TEAM_ID)).toHaveLength(5)
  })

  it('excludes matches with no scheduledAt', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: null, status: 'PLAYED', homeTeamId: TEAM_ID })
    expect(filterRecentResults([m], TEAM_ID)).toHaveLength(0)
  })
})
