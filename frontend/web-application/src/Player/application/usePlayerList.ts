import { useGetTeamPlayers } from '../infrastructure/usePlayerApi'

export const usePlayerList = (teamId: string | undefined | null) => useGetTeamPlayers(teamId, undefined)
