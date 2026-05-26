import type { User } from '@Sdk/model'
import type { Match } from '@Sdk/model/match'
import { buildRoleDistribution, buildFeedEvents } from './useAdminDashboard'

const makeMatch = (overrides: Partial<Match> & { id: string }): Match => ({
  id: overrides.id,
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
  ...overrides,
})

const makeUser = (overrides: Partial<User> & { _id: string }): User => ({
  _id: overrides._id,
  isAdmin: false,
  isActive: true,
  isBlocked: false,
  isReferee: false,
  firstName: 'First',
  lastName: 'Last',
  email: 'test@test.io',
  ...overrides,
})

const admin: User = {
  _id: '1',
  isAdmin: true,
  lastName: 'Admin',
  firstName: 'Admin',
  email: 'Admin@admin.io',
  isActive: true,
  isBlocked: false,
  isReferee: false,
}

const user: User = {
  _id: '1',
  isAdmin: false,
  lastName: 'User',
  firstName: 'User',
  email: 'user@user.io',
  isBlocked: false,
  isReferee: false,
  isActive: true,
}

describe('buildFeedEvents', () => {
  it('returns empty array when all inputs are empty', () => {
    expect(buildFeedEvents({})).toEqual([])
  })

  it('maps inactiveUsers to ACTIVATION_REQUEST events', () => {
    const u = makeUser({ _id: 'u1', createdAt: '2025-01-01T00:00:00Z' })
    const [event] = buildFeedEvents({ inactiveUsers: [u] })
    expect(event.type).toBe('ACTIVATION_REQUEST')
    expect(event.id).toBe('activation-u1')
    expect(event.firstName).toBe('First')
  })

  it('maps forfeitedMatches to FORFEIT events', () => {
    const m = makeMatch({ id: 'm1', scheduledAt: '2025-03-01T00:00:00Z' })
    const [event] = buildFeedEvents({ forfeitedMatches: [m] })
    expect(event.type).toBe('FORFEIT')
    expect(event.id).toBe('forfeit-m1')
  })

  it('sorts events by date descending', () => {
    const older = makeMatch({ id: 'old', scheduledAt: '2025-01-01T00:00:00Z' })
    const newer = makeMatch({ id: 'new', scheduledAt: '2025-06-01T00:00:00Z' })
    const events = buildFeedEvents({ forfeitedMatches: [older, newer] })
    expect(events[0].id).toBe('forfeit-new')
    expect(events[1].id).toBe('forfeit-old')
  })

  it('slices result to 20 events max', () => {
    const matches = Array.from({ length: 25 }, (_, i) =>
      makeMatch({ id: `m${i}`, scheduledAt: `2025-0${(i % 9) + 1}-01T00:00:00Z` })
    )
    expect(buildFeedEvents({ playedMatches: matches })).toHaveLength(20)
  })
})

describe('buildRoleDistribution', () => {
  it('should return an empty array when there is no users', () => {
    expect(buildRoleDistribution([])).toEqual([])
    expect(buildRoleDistribution()).toEqual([])
  })

  it('should return one entry Admin when at least one user is admin', () => {
    expect(buildRoleDistribution([admin])).toEqual([{ role: 'admin', color: 'var(--chart-color-admin)', count: 1 }])
  })
  it('should return only roles where count > 0', () => {
    expect(
      buildRoleDistribution([
        { ...user, roles: ['COACH'] },
        { ...user, roles: ['COACH'] },
      ])
    ).toEqual([{ role: 'coach', color: 'var(--chart-color-coach)', count: 2 }])
  })

  it('takes in account multi roles', () => {
    expect(buildRoleDistribution([{ ...admin, roles: ['COACH', 'PLAYER'] }])).toEqual([
      { role: 'admin', color: 'var(--chart-color-admin)', count: 1 },
      { role: 'coach', color: 'var(--chart-color-coach)', count: 1 },
      { role: 'player', color: 'var(--chart-color-player)', count: 1 },
    ])
  })

  it('return noRole entry when at least one user is not admin and has no role', () => {
    expect(buildRoleDistribution([user])).toEqual([{ role: 'noRole', color: 'var(--chart-color-other)', count: 1 }])
    expect(buildRoleDistribution([{ ...user, roles: [] }])).toEqual([
      { role: 'noRole', color: 'var(--chart-color-other)', count: 1 },
    ])
  })
})
