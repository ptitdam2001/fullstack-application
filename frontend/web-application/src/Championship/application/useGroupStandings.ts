import { useGetGroupStandingsSuspense } from '../infrastructure/useStandingsApi'

export const useGroupStandings = (groupId: string) => useGetGroupStandingsSuspense(groupId)
