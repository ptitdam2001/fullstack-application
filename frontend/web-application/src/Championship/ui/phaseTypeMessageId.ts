import { PhaseType } from '../domain/Phase'

export const PHASE_TYPE_MESSAGE_ID: Record<PhaseType, string> = {
  [PhaseType.GROUP]: 'adminChampionships.phaseType.GROUP',
  [PhaseType.KNOCKOUT]: 'adminChampionships.phaseType.KNOCKOUT',
}
