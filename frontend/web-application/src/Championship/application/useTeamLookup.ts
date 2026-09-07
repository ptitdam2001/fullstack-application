import { useGetTeamsSuspense } from '../infrastructure/useTeamsApi'

const MAX_TEAMS = 200

export type TeamSummary = { name: string; color: string | null }

export const useTeamLookup = (): Record<string, TeamSummary> => {
  const { data: teams } = useGetTeamsSuspense({ page: 1, limit: MAX_TEAMS })
  return Object.fromEntries(teams.map(team => [team.id, { name: team.name, color: team.color ?? null }]))
}
