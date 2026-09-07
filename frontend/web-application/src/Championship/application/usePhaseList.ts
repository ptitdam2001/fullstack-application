import { useGetChampionshipPhasesSuspense } from '../infrastructure/usePhaseApi'

export const usePhaseList = (championshipId: string) => {
  const query = useGetChampionshipPhasesSuspense(championshipId)
  const phases = [...query.data].sort((a, b) => a.order - b.order)
  return { ...query, data: phases }
}
