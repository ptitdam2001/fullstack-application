import { useGetMatchesSuspense } from '../infrastructure/useMatchApi'

const MAX_CHAMPIONSHIP_MATCHES = 300

export const useChampionshipMatches = (championshipId: string) =>
  useGetMatchesSuspense({ championshipId, count: MAX_CHAMPIONSHIP_MATCHES })
