import { useGetMyTeams } from '@Sdk/user-team/user-team'
import { useGetTeams } from '@Sdk/teams/teams'
import { useGetMatches } from '@Sdk/match/match'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { DASHBOARD_POLLING_INTERVAL_MS } from '@Config/dashboard.config'
import type { Match } from '@Sdk/model/match'

export const filterUpcomingMatches = (matches: Match[], now = new Date()): Match[] =>
  matches
    .filter(m => m.status === MatchStatus.SCHEDULED && m.scheduledAt != null && new Date(m.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())

export const filterRecentResults = (matches: Match[], teamId: string): Match[] =>
  matches
    .filter(
      m =>
        m.status === MatchStatus.PLAYED && m.scheduledAt != null && (m.homeTeamId === teamId || m.awayTeamId === teamId)
    )
    .sort((a, b) => new Date(b.scheduledAt!).getTime() - new Date(a.scheduledAt!).getTime())
    .slice(0, 5)

export const usePlayerDashboard = () => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  const { data: myTeams = [] } = useGetMyTeams({ query: { refetchInterval } })
  const playerTeams = myTeams.filter(ut => ut.role === 'PLAYER').map(ut => ut.team)

  const { data: allTeams = [] } = useGetTeams(undefined, { query: { refetchInterval } })
  const { data: allMatches = [] } = useGetMatches(undefined, { query: { refetchInterval } })

  return {
    playerTeams,
    allTeams,
    upcomingMatches: filterUpcomingMatches(allMatches),
    allMatches,
  }
}
