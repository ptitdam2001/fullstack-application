import { useGetTeams } from '@Sdk/teams/teams'
import { useGetMatches } from '@Sdk/match/match'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { DASHBOARD_POLLING_INTERVAL_MS } from '@Config/dashboard.config'

export const usePlayerDashboard = () => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  const { data: allTeams = [] } = useGetTeams(undefined, { query: { refetchInterval } })
  const { data: allMatches = [] } = useGetMatches(undefined, { query: { refetchInterval } })

  const now = new Date()
  const upcomingMatches = allMatches
    .filter((m) => m.status === MatchStatus.SCHEDULED && m.scheduledAt != null && new Date(m.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())

  return { allTeams, upcomingMatches }
}