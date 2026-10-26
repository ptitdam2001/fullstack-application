import { useGetSeason } from '../infrastructure/useSeasonApi'

export const useSeasonDetail = (seasonId: string) => useGetSeason(seasonId)
