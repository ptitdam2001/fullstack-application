import { useGetPhaseGroupsSuspense } from '../infrastructure/useGroupApi'

export const usePhaseGroups = (phaseId: string) => useGetPhaseGroupsSuspense(phaseId)
