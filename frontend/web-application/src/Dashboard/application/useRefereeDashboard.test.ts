import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import type { Match } from '@Sdk/model/match'
import type { Team } from '@Sdk/model/team'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { splitRefereeMatches, teamNameMap } from './useRefereeDashboard'

const makeMatch = (overrides: Partial<Match> = {}): Match =>
  ({
    id: 'match-1',
    homeTeamId: 'team-a',
    awayTeamId: 'team-b',
    status: MatchStatus.SCHEDULED,
    scheduledAt: dayjs().add(1, 'day').toISOString(),
    area: { id: 'area-1', name: 'Field 1' },
    homeGoals: null,
    awayGoals: null,
    ...overrides,
  }) as Match

const NOW = dayjs('2025-06-01T12:00:00Z')
const PAST = '2025-05-28T10:00:00Z'
const FUTURE = '2025-06-05T10:00:00Z'

describe('splitRefereeMatches', () => {
  it('returns empty arrays when no matches', () => {
    const result = splitRefereeMatches(new Set(), [], NOW)
    expect(result.urgentMatches).toHaveLength(0)
    expect(result.upcomingMatches).toHaveLength(0)
  })

  it('excludes matches not assigned to referee', () => {
    const match = makeMatch({ id: 'match-1', scheduledAt: FUTURE })
    const result = splitRefereeMatches(new Set(['other-match']), [match], NOW)
    expect(result.upcomingMatches).toHaveLength(0)
  })

  it('classifies past scheduled matches as urgent', () => {
    const match = makeMatch({ id: 'match-1', scheduledAt: PAST })
    const result = splitRefereeMatches(new Set(['match-1']), [match], NOW)
    expect(result.urgentMatches).toHaveLength(1)
    expect(result.upcomingMatches).toHaveLength(0)
  })

  it('classifies future scheduled matches as upcoming', () => {
    const match = makeMatch({ id: 'match-1', scheduledAt: FUTURE })
    const result = splitRefereeMatches(new Set(['match-1']), [match], NOW)
    expect(result.urgentMatches).toHaveLength(0)
    expect(result.upcomingMatches).toHaveLength(1)
  })

  it('excludes non-SCHEDULED matches', () => {
    const match = makeMatch({ id: 'match-1', scheduledAt: FUTURE, status: MatchStatus.PLAYED })
    const result = splitRefereeMatches(new Set(['match-1']), [match], NOW)
    expect(result.upcomingMatches).toHaveLength(0)
  })

  it('excludes matches with null scheduledAt', () => {
    const match = makeMatch({ id: 'match-1', scheduledAt: null as unknown as string })
    const result = splitRefereeMatches(new Set(['match-1']), [match], NOW)
    expect(result.urgentMatches).toHaveLength(0)
    expect(result.upcomingMatches).toHaveLength(0)
  })

  it('sorts urgent matches oldest first', () => {
    const older = makeMatch({ id: 'match-old', scheduledAt: '2025-05-20T10:00:00Z' })
    const newer = makeMatch({ id: 'match-new', scheduledAt: '2025-05-29T10:00:00Z' })
    const result = splitRefereeMatches(new Set(['match-old', 'match-new']), [newer, older], NOW)
    expect(result.urgentMatches[0].id).toBe('match-old')
    expect(result.urgentMatches[1].id).toBe('match-new')
  })

  it('caps upcoming matches at 5', () => {
    const matches = Array.from({ length: 8 }, (_, i) =>
      makeMatch({ id: `match-${i}`, scheduledAt: dayjs(FUTURE).add(i, 'day').toISOString() })
    )
    const ids = new Set(matches.map(m => m.id))
    const result = splitRefereeMatches(ids, matches, NOW)
    expect(result.upcomingMatches).toHaveLength(5)
  })
})

describe('teamNameMap', () => {
  it('returns empty object for empty teams', () => {
    expect(teamNameMap([])).toEqual({})
  })

  it('maps team ids to names', () => {
    const teams: Team[] = [{ id: 'team-1', name: 'Alpha' } as Team, { id: 'team-2', name: 'Beta' } as Team]
    expect(teamNameMap(teams)).toEqual({ 'team-1': 'Alpha', 'team-2': 'Beta' })
  })
})
