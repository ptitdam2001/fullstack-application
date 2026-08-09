import { FormattedMessage, useIntl, type IntlShape } from 'react-intl'
import { Button, Card, Layout, Separator, Typography } from '@repo/design-system'
import { useSeasonList } from '@Season/application/useSeasonList'
import { useAgeCategoryList } from '@AgeCategory/application/useAgeCategoryList'
import { useTeamOptions } from '@Teams/application/useTeamOptions'
import { useChampionshipWizard, WIZARD_STEPS, type ChampionshipWizardGroup } from '../application/useChampionshipWizard'
import { useCreateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreatePhase } from '../infrastructure/usePhaseApi'
import { PhaseType } from '../domain/Phase'
import { WizardProgress } from '../ui/WizardProgress/WizardProgress'
import { WizardSummary } from '../ui/WizardSummary/WizardSummary'
import { StepSeason } from '../ui/StepSeason/StepSeason'
import { StepCategory } from '../ui/StepCategory/StepCategory'
import { StepName } from '../ui/StepName/StepName'
import { StepPhase } from '../ui/StepPhase/StepPhase'
import { StepTeamsGroups } from '../ui/StepTeamsGroups/StepTeamsGroups'
import { StepTeamsKnockout } from '../ui/StepTeamsKnockout/StepTeamsKnockout'

const formatTeamsValue = (
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

export const ChampionshipWizardPage = () => {
  const intl = useIntl()
  const wizard = useChampionshipWizard()

  const seasonList = useSeasonList()
  const categoryList = useAgeCategoryList()
  const createChampionship = useCreateChampionship()
  const createPhase = useCreatePhase()

  const teamOptions = useTeamOptions()

  const seasons = seasonList.query.data ?? []
  const categories = categoryList.query.data ?? []
  const selectedSeason = seasons.find(s => s.id === wizard.seasonId) ?? null
  const selectedCategory = categories.find(c => c.id === wizard.categoryId) ?? null
  const categoryTeams = teamOptions.filter(t => t.ageCategoryId === wizard.categoryId)

  const handleNext = () => {
    if (wizard.step === 2 && !wizard.championshipId && wizard.categoryId && wizard.seasonId) {
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

    if (wizard.step === 3 && wizard.championshipId && wizard.phaseType) {
      createPhase.mutate(
        { data: { championshipId: wizard.championshipId, type: wizard.phaseType, order: 1 } },
        { onSuccess: () => wizard.next() }
      )
      return
    }

    wizard.next()
  }

  const isNextPending =
    (wizard.step === 2 && createChampionship.isPending) || (wizard.step === 3 && createPhase.isPending)

  const teamsValue = formatTeamsValue(intl, wizard.phaseType, wizard.groups, wizard.teamIds)

  const configValue =
    wizard.phaseType === PhaseType.GROUP && wizard.groups.some(g => g.generated)
      ? intl.formatMessage(
          { id: 'championshipWizard.summary.configGroupValue' },
          { generatedCount: wizard.groups.filter(g => g.generated).length, groupCount: wizard.groups.length }
        )
      : null

  const summaryLines = [
    { key: 'season', labelId: 'championshipWizard.summary.season', value: selectedSeason?.label ?? null },
    { key: 'category', labelId: 'championshipWizard.summary.category', value: selectedCategory?.label ?? null },
    { key: 'name', labelId: 'championshipWizard.summary.name', value: wizard.name.trim() || null },
    {
      key: 'phase',
      labelId: 'championshipWizard.summary.phase',
      value: wizard.phaseType ? intl.formatMessage({ id: `championshipWizard.phaseType.${wizard.phaseType}` }) : null,
    },
    { key: 'teams', labelId: 'championshipWizard.summary.teams', value: teamsValue },
    { key: 'config', labelId: 'championshipWizard.summary.config', value: configValue },
  ]

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="championshipWizard.title" />
          </Typography.Title1>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content className="flex flex-col gap-6 p-6">
        <WizardProgress currentStep={wizard.step} canGoNext={wizard.canNext} onStepClick={wizard.goTo} />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_260px]">
          <Card.Container>
            <Card.Content className="flex flex-col gap-4">
              {wizard.step === 0 && (
                <StepSeason seasons={seasons} selectedId={wizard.seasonId} onSelect={wizard.setSeasonId} />
              )}
              {wizard.step === 1 && (
                <StepCategory categories={categories} selectedId={wizard.categoryId} onSelect={wizard.setCategoryId} />
              )}
              {wizard.step === 2 && (
                <StepName
                  name={wizard.name}
                  onChange={wizard.setName}
                  categoryLabel={selectedCategory?.label}
                  categoryGenreLabel={
                    selectedCategory
                      ? intl.formatMessage({ id: `adminAgeCategories.genre.${selectedCategory.genre}` })
                      : undefined
                  }
                  seasonYear={selectedSeason?.label.slice(-4)}
                />
              )}
              {wizard.step === 3 && <StepPhase phaseType={wizard.phaseType} onSelect={wizard.setPhaseType} />}
              {wizard.step === 4 && wizard.phaseType === PhaseType.GROUP && (
                <StepTeamsGroups
                  teams={categoryTeams}
                  groups={wizard.groups}
                  onAddGroup={wizard.addGroup}
                  onRemoveGroup={wizard.removeGroup}
                  onRenameGroup={wizard.renameGroup}
                  onAssignTeam={wizard.assignTeam}
                />
              )}
              {wizard.step === 4 && wizard.phaseType === PhaseType.KNOCKOUT && (
                <StepTeamsKnockout teams={categoryTeams} teamIds={wizard.teamIds} onToggleTeam={wizard.toggleTeam} />
              )}
              {wizard.step >= 5 && (
                <Typography.Title2>
                  <FormattedMessage id={WIZARD_STEPS[wizard.step].labelId} />
                </Typography.Title2>
              )}

              {createChampionship.isError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.createFailed" />
                </Typography.Body>
              )}
              {createPhase.isError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.createPhaseFailed" />
                </Typography.Body>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onPress={wizard.back} isDisabled={wizard.step === 0}>
                  <FormattedMessage id="championshipWizard.action.previous" />
                </Button>
                <Button variant="outline" onPress={handleNext} isDisabled={!wizard.canNext || isNextPending}>
                  <FormattedMessage id="championshipWizard.action.next" />
                </Button>
              </div>
            </Card.Content>
          </Card.Container>

          <WizardSummary lines={summaryLines} onJump={wizard.goTo} />
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}
