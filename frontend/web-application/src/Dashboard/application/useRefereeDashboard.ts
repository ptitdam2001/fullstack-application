import dayjs from 'dayjs'
import { useGetUserMatches } from '@Sdk/user-match/user-match'
import { useGetMatches } from '@Sdk/match/match'
import { useGetTeams } from '@Sdk/teams/teams'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { DASHBOARD_POLLING_INTERVAL_MS } from '@Config/dashboard.config'
import type { Match } from '@Sdk/model/match'
import type { Team } from '@Sdk/model/team'

export const splitRefereeMatches = (
  refereeMatchIds: Set<string>,
  allMatches: Match[],
  now = dayjs()
): { urgentMatches: Match[]; upcomingMatches: Match[] } => {
  const refereeMatches = allMatches.filter(m => refereeMatchIds.has(m.id) && m.status === MatchStatus.SCHEDULED)

  const urgentMatches = refereeMatches
    .filter(m => m.scheduledAt != null && dayjs(m.scheduledAt).isBefore(now))
    .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf())

  const upcomingMatches = refereeMatches
    .filter(m => m.scheduledAt != null && dayjs(m.scheduledAt).isAfter(now))
    .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf())
    .slice(0, 5)

  return { urgentMatches, upcomingMatches }
}

export const teamNameMap = (teams: Team[]): Record<string, string> => Object.fromEntries(teams.map(t => [t.id, t.name]))

export const useRefereeDashboard = (userId: string) => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  const { data: userMatches = [] } = useGetUserMatches(userId, { query: { refetchInterval } })
  const { data: allMatches = [] } = useGetMatches(undefined, { query: { refetchInterval } })
  const { data: allTeams = [] } = useGetTeams(undefined, { query: { refetchInterval } })

  const refereeMatchIds = new Set(userMatches.map(um => um.matchId))
  const { urgentMatches, upcomingMatches } = splitRefereeMatches(refereeMatchIds, allMatches)

  return { urgentMatches, upcomingMatches, teamNames: teamNameMap(allTeams) }
}
