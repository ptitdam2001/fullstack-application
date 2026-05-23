import { useGetMatches } from '@Sdk/match/match'
import { useGetUsers } from '@Sdk/users/users'
import { useGetTeams, useCountTeams } from '@Sdk/teams/teams'
import { useCountChampionships } from '@Sdk/championship/championship'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { DASHBOARD_POLLING_INTERVAL_MS } from '@Config/dashboard.config'
import type { FeedEvent, RoleDistributionEntry } from '../domain/Dashboard'
import type { User } from '@Sdk/model/user'
import type { Match } from '@Sdk/model/match'

export const buildFeedEvents = ({
  inactiveUsers,
  forfeitedMatches,
  playedMatches,
}: {
  inactiveUsers?: User[]
  forfeitedMatches?: Match[]
  playedMatches?: Match[]
}): FeedEvent[] => {
  const now = new Date().toISOString()
  const events: FeedEvent[] = [
    ...(inactiveUsers ?? []).map(
      (u): FeedEvent => ({
        id: `activation-${u._id}`,
        type: 'ACTIVATION_REQUEST',
        date: u.createdAt ?? now,
        href: `/app/users/${u._id}`,
        actionLabel: 'adminDashboard.feed.activate',
        firstName: u.firstName,
        lastName: u.lastName ?? '',
      })
    ),
    ...(forfeitedMatches ?? []).map(
      (m): FeedEvent => ({
        id: `forfeit-${m.id}`,
        type: 'FORFEIT',
        date: m.scheduledAt ?? now,
        href: `/app/games/${m.id}`,
      })
    ),
    ...(playedMatches ?? []).map(
      (m): FeedEvent => ({
        id: `played-${m.id}`,
        type: 'MATCH_COMPLETED',
        date: m.scheduledAt ?? now,
        href: `/app/games/${m.id}`,
      })
    ),
  ]

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20)
}

export const buildRoleDistribution = (_users?: User[]): RoleDistributionEntry[] => {
  const initialData = {
    ADMIN: {
      role: 'admin',
      color: 'var(--chart-color-admin)',
      count: 0,
    },
    COACH: {
      role: 'coach',
      color: 'var(--chart-color-coach)',
      count: 0,
    },
    PLAYER: {
      role: 'player',
      color: 'var(--chart-color-player)',
      count: 0,
    },
    REFEREE: {
      role: 'referee',
      color: 'var(--chart-color-referee)',
      count: 0,
    },
    NOROLE: {
      role: 'noRole',
      color: 'var(--chart-color-other)',
      count: 0,
    },
  }

  if (!_users || _users.length === 0) {
    return []
  }

  return Object.values(
    _users.reduce((acc, currentUser) => {
      if (currentUser.isAdmin) {
        acc.ADMIN.count++
      } else if (!currentUser.roles || currentUser.roles.length === 0) {
        acc.NOROLE.count++
      }

      currentUser.roles?.forEach(role => acc[role].count++)

      return acc
    }, initialData)
  ).filter(item => item.count > 0)
}

export const useAdminDashboard = () => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  const { data: overdueMatches } = useGetMatches(
    { status: MatchStatus.SCHEDULED, pastDue: true },
    { query: { refetchInterval } }
  )
  const { data: inactiveUsers } = useGetUsers({ isActive: false }, { query: { refetchInterval } })
  const { data: forfeitedMatches } = useGetMatches({ status: MatchStatus.FORFEITED }, { query: { refetchInterval } })
  const { data: playedMatches } = useGetMatches({ status: MatchStatus.PLAYED }, { query: { refetchInterval } })
  const { data: allUsers } = useGetUsers()
  const { data: championshipCount } = useCountChampionships()
  const { data: teamCount } = useCountTeams()
  useGetTeams(undefined, { query: { refetchInterval } })

  return {
    pendingScoreCount: overdueMatches?.length ?? 0,
    pendingActivationCount: inactiveUsers?.length ?? 0,
    championshipCount: championshipCount ?? 0,
    teamCount: teamCount ?? 0,
    feedEvents: buildFeedEvents({ inactiveUsers, forfeitedMatches, playedMatches }),
    roleDistribution: buildRoleDistribution(allUsers),
  }
}
