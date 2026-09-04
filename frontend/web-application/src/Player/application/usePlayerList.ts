import { useGetTeamPlayersSuspense } from '../infrastructure/usePlayerApi'

export const usePlayerList = (teamId: string | undefined | null) => useGetTeamPlayersSuspense(teamId, undefined)
