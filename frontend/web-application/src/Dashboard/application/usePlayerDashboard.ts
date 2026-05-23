import { useGetTeams } from '@Sdk/teams/teams'
import { useGetMatches } from '@Sdk/match/match'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { DASHBOARD_POLLING_INTERVAL_MS } from '@Config/dashboard.config'
import type { Match } from '@Sdk/model/match'

export const filterUpcomingMatches = (matches: Match[], now = new Date()): Match[] =>
  matches
    .filter((m) => m.status === MatchStatus.SCHEDULED && m.scheduledAt != null && new Date(m.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())

export const usePlayerDashboard = () => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  const { data: allTeams = [] } = useGetTeams(undefined, { query: { refetchInterval } })
  const { data: allMatches = [] } = useGetMatches(undefined, { query: { refetchInterval } })

  return { allTeams, upcomingMatches: filterUpcomingMatches(allMatches) }
}