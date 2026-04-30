import { useGetTeam } from '../infrastructure/useTeamApi'

export const useTeamDetail = (teamId: string | undefined | null) =>
  useGetTeam(teamId, { query: { retry: 0 } })
