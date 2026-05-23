import { useGetCoachTeams } from '@Sdk/user-team/user-team'
import { useGetTeams } from '@Sdk/teams/teams'
import { useGetMatches } from '@Sdk/match/match'
import type { CoachDashboardStats } from '../domain/Dashboard'

export const useCoachDashboard = (userId: string) => {
  const { data: userTeams = [] } = useGetCoachTeams(userId)
  const teamIds = userTeams.map((ut) => ut.teamId)

  const { data: allTeams = [] } = useGetTeams()
  const teams = allTeams.filter((t) => teamIds.includes(t.id))

  const { data: allMatches = [] } = useGetMatches()
  const now = new Date()
  const upcomingMatches = allMatches
    .filter(
      (currentMatch) =>
        (teamIds.includes(currentMatch.homeTeamId) || teamIds.includes(currentMatch.awayTeamId)) &&
        currentMatch.scheduledAt != null &&
        new Date(currentMatch.scheduledAt) >= now
    )
    .sort((item1, item2) => new Date(item1.scheduledAt!).getTime() - new Date(item2.scheduledAt!).getTime())
    .slice(0, 8)

  const stats: CoachDashboardStats = {
    teamCount: teams.length,
    upcomingMatchCount: upcomingMatches.length,
  }

  return { teams, upcomingMatches, allMatches, stats }
}