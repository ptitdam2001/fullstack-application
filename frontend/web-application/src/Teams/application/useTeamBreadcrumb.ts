import { useGetTeam } from '../infrastructure/useTeamApi'

export const useTeamBreadcrumb = (teamId: string) => useGetTeam(teamId, { query: { enabled: !!teamId } })
