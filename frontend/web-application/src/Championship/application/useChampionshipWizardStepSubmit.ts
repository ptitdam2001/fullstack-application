import { useCreateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreatePhase } from '../infrastructure/usePhaseApi'
import type { ChampionshipWizard } from './useChampionshipWizard'
import type { PhaseType } from '../domain/Phase'

type WizardReadyForChampionship = ChampionshipWizard & { categoryId: string; seasonId: string }
type WizardReadyForPhase = ChampionshipWizard & { championshipId: string; phaseType: PhaseType }

const shouldCreateChampionship = (wizard: ChampionshipWizard): wizard is WizardReadyForChampionship =>
  wizard.step === 2 && !wizard.championshipId && Boolean(wizard.categoryId) && Boolean(wizard.seasonId)

const shouldCreatePhase = (wizard: ChampionshipWizard): wizard is WizardReadyForPhase =>
  wizard.step === 3 && !wizard.phaseId && Boolean(wizard.championshipId) && Boolean(wizard.phaseType)

export const useChampionshipWizardStepSubmit = (wizard: ChampionshipWizard) => {
  const createChampionship = useCreateChampionship()
  const createPhase = useCreatePhase()

  const handleNext = () => {
    if (shouldCreateChampionship(wizard)) {
      createChampionship.mutate(
        {
          data: {
            name: wizard.name.trim(),
            ageCategoryId: wizard.categoryId,
            seasonId: wizard.seasonId,
            pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
          },
        },
        {
          onSuccess: championship => {
            wizard.setChampionshipId(championship.id)
            wizard.next()
          },
        }
      )
      return
    }

    if (shouldCreatePhase(wizard)) {
      createPhase.mutate(
        { data: { championshipId: wizard.championshipId, type: wizard.phaseType, order: 1 } },
        {
          onSuccess: phase => {
            wizard.setPhaseId(phase.id)
            wizard.next()
          },
        }
      )
      return
    }

    wizard.next()
  }

  const isNextPending =
    (wizard.step === 2 && createChampionship.isPending) || (wizard.step === 3 && createPhase.isPending)

  return {
    handleNext,
    isNextPending,
    createChampionshipError: createChampionship.isError,
    createPhaseError: createPhase.isError,
  }
}
