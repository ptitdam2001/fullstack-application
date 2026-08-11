import type { IntlShape } from 'react-intl'
import type { Season } from '@Season/domain/Season'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'
import { PhaseType } from '../domain/Phase'
import type { ChampionshipWizard, ChampionshipWizardGroup } from './useChampionshipWizard'

export const formatTeamsValue = (
  intl: IntlShape,
  phaseType: PhaseType | null,
  groups: ChampionshipWizardGroup[],
  teamIds: string[]
): string | null => {
  if (phaseType === PhaseType.GROUP) {
    if (!groups.some(g => g.teamIds.length > 0)) {
      return null
    }
    return intl.formatMessage(
      { id: 'championshipWizard.summary.teamsGroupValue' },
      { groupCount: groups.length, teamCount: groups.reduce((sum, g) => sum + g.teamIds.length, 0) }
    )
  }
  if (teamIds.length === 0) {
    return null
  }
  return intl.formatMessage({ id: 'championshipWizard.summary.teamsKnockoutValue' }, { teamCount: teamIds.length })
}

export const useChampionshipWizardSummary = (
  wizard: ChampionshipWizard,
  intl: IntlShape,
  selectedSeason: Season | null,
  selectedCategory: AgeCategory | null
) => {
  const teamsValue = formatTeamsValue(intl, wizard.phaseType, wizard.groups, wizard.teamIds)

  const categoryValue = selectedCategory
    ? intl.formatMessage(
        { id: 'championshipWizard.summary.categoryValue' },
        {
          categoryLabel: selectedCategory.label,
          genreLabel: intl.formatMessage({ id: `adminAgeCategories.genre.${selectedCategory.genre}` }),
        }
      )
    : null

  const configValue =
    wizard.phaseType === PhaseType.GROUP && wizard.groups.some(g => g.generated)
      ? intl.formatMessage(
          { id: 'championshipWizard.summary.configGroupValue' },
          { generatedCount: wizard.groups.filter(g => g.generated).length, groupCount: wizard.groups.length }
        )
      : null

  return [
    { key: 'season', labelId: 'championshipWizard.summary.season', value: selectedSeason?.label ?? null },
    { key: 'category', labelId: 'championshipWizard.summary.category', value: categoryValue },
    { key: 'name', labelId: 'championshipWizard.summary.name', value: wizard.name.trim() || null },
    {
      key: 'phase',
      labelId: 'championshipWizard.summary.phase',
      value: wizard.phaseType ? intl.formatMessage({ id: `championshipWizard.phaseType.${wizard.phaseType}` }) : null,
    },
    { key: 'teams', labelId: 'championshipWizard.summary.teams', value: teamsValue },
    { key: 'config', labelId: 'championshipWizard.summary.config', value: configValue },
  ]
}
