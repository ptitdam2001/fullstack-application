import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useGetChampionship } from '../infrastructure/useChampionshipApi'
import { useGetChampionshipPhases } from '../infrastructure/usePhaseApi'
import type { ChampionshipWizard } from './useChampionshipWizard'

const PHASE_STEP = 3
const TEAMS_STEP = 4

export const useChampionshipWizardResume = (wizard: ChampionshipWizard) => {
  const { championshipId } = useParams<{ championshipId?: string }>()

  const championshipQuery = useGetChampionship(championshipId)
  const phasesQuery = useGetChampionshipPhases(championshipId)

  const isLoading = Boolean(championshipId) && !wizard.championshipId

  useEffect(() => {
    if (!championshipId || wizard.championshipId || !championshipQuery.data || !phasesQuery.data) {
      return
    }
    const championship = championshipQuery.data
    const phase = phasesQuery.data[0] ?? null

    wizard.hydrate({
      seasonId: championship.seasonId,
      categoryId: championship.ageCategoryId,
      name: championship.name ?? '',
      championshipId: championship.id,
      phaseType: phase?.type ?? null,
      phaseId: phase?.id ?? null,
      maxRank: phase?.qualification?.maxRank ?? null,
      step: phase ? TEAMS_STEP : PHASE_STEP,
    })
  }, [championshipId, championshipQuery.data, phasesQuery.data, wizard])

  return { isLoading }
}
