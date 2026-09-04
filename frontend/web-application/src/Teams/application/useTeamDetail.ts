import { useGetTeam, useGetTeamSuspense } from '../infrastructure/useTeamApi'

export const useTeamDetail = (teamId: string | undefined | null) => useGetTeam(teamId, { query: { retry: 0 } })

export const useTeamDetailSuspense = (teamId: string) => useGetTeamSuspense(teamId, { query: { retry: 0 } })
