import { useGetChampionship } from '../infrastructure/useChampionshipApi'

export const useChampionshipBreadcrumb = (championshipId: string) =>
  useGetChampionship(championshipId, { query: { enabled: !!championshipId } })
