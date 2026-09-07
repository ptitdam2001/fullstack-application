import { useGetChampionshipSuspense } from '../infrastructure/useChampionshipApi'

export const useChampionshipDetail = (championshipId: string) => useGetChampionshipSuspense(championshipId)
