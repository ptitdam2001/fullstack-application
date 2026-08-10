import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useUpdateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreateGroup, useGenerateGroupMatches } from '../infrastructure/useGroupApi'
import { useCreateBracket, useGenerateBracketMatches } from '../infrastructure/useBracketApi'
import { buildBracketTeamEntries } from './buildBracketTeamEntries'
import { PhaseType } from '../domain/Phase'
import type { ChampionshipWizard } from './useChampionshipWizard'

const REDIRECT_ON_FINISH = '/app/admin/championships'

export const useChampionshipWizardFinalSubmit = (wizard: ChampionshipWizard) => {
  const navigate = useNavigate()
  const updateChampionship = useUpdateChampionship()
  const createGroup = useCreateGroup()
  const generateGroupMatches = useGenerateGroupMatches()
  const createBracket = useCreateBracket()
  const generateBracketMatches = useGenerateBracketMatches()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const handleSubmit = async () => {
    if (!wizard.championshipId || !wizard.phaseId) {
      return
    }

    setSubmitError(false)
    setIsSubmitting(true)
    try {
      if (wizard.phaseType === PhaseType.GROUP) {
        if (wizard.categoryId && wizard.seasonId) {
          await updateChampionship.mutateAsync({
            id: wizard.championshipId,
            data: {
              name: wizard.name.trim(),
              ageCategoryId: wizard.categoryId,
              seasonId: wizard.seasonId,
              pointsConfig: wizard.points,
            },
          })
        }
        await Promise.all(
          wizard.groups.map(async group => {
            const created = await createGroup.mutateAsync({
              data: { phaseId: wizard.phaseId!, name: group.name, matchMode: group.matchMode, teamIds: group.teamIds },
            })
            await generateGroupMatches.mutateAsync({ id: created.id })
          })
        )
      } else if (wizard.phaseType === PhaseType.KNOCKOUT) {
        const bracketTeams = buildBracketTeamEntries(wizard.teamIds)
        const bracket = await createBracket.mutateAsync({
          data: { phaseId: wizard.phaseId, name: wizard.name.trim(), bracketTeams },
        })
        await generateBracketMatches.mutateAsync({ id: bracket.id })
      }
      navigate(REDIRECT_ON_FINISH)
    } catch {
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { handleSubmit, isSubmitting, submitError }
}
