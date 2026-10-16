import { useGetTeamsSuspense } from '../infrastructure/useTeamsApi'

export type TeamSummary = { name: string; color: string | null }

export const useTeamLookup = (): Record<string, TeamSummary> => {
  // Without page nor count, GET /teams returns every team
  const { data: teams } = useGetTeamsSuspense()
  return Object.fromEntries(teams.map(team => [team.id, { name: team.name, color: team.color ?? null }]))
}
