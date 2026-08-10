import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card, Layout, Separator, Typography } from '@repo/design-system'
import { useSeasonList } from '@Season/application/useSeasonList'
import { useAgeCategoryList } from '@AgeCategory/application/useAgeCategoryList'
import { useTeamOptions } from '@Teams/application/useTeamOptions'
import { useChampionshipWizard } from '../application/useChampionshipWizard'
import { useChampionshipWizardStepSubmit } from '../application/useChampionshipWizardStepSubmit'
import { useChampionshipWizardFinalSubmit } from '../application/useChampionshipWizardFinalSubmit'
import { useChampionshipWizardSummary } from '../application/useChampionshipWizardSummary'
import { useChampionshipWizardCancel } from '../application/useChampionshipWizardCancel'
import { PhaseType } from '../domain/Phase'
import { WizardProgress } from '../ui/WizardProgress/WizardProgress'
import { WizardSummary } from '../ui/WizardSummary/WizardSummary'
import { ConfirmCancelWizardDialog } from '../ui/ChampionshipWizardCancel/ConfirmCancelWizardDialog'
import { StepSeason } from '../ui/StepSeason/StepSeason'
import { StepCategory } from '../ui/StepCategory/StepCategory'
import { StepName } from '../ui/StepName/StepName'
import { StepPhase } from '../ui/StepPhase/StepPhase'
import { StepTeamsGroups } from '../ui/StepTeamsGroups/StepTeamsGroups'
import { StepTeamsKnockout } from '../ui/StepTeamsKnockout/StepTeamsKnockout'
import { StepConfigGroup } from '../ui/StepConfigGroup/StepConfigGroup'
import { StepConfigKnockout } from '../ui/StepConfigKnockout/StepConfigKnockout'

const LAST_STEP = 5

export const ChampionshipWizardPage = () => {
  const intl = useIntl()
  const wizard = useChampionshipWizard()

  const seasonList = useSeasonList()
  const categoryList = useAgeCategoryList()
  const teamOptions = useTeamOptions()

  const { handleNext, isNextPending, createChampionshipError, createPhaseError } =
    useChampionshipWizardStepSubmit(wizard)
  const { handleSubmit, isSubmitting, submitError } = useChampionshipWizardFinalSubmit(wizard)
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleCancelPress,
    handleKeepForLater,
    handleDeletePermanently,
    isDeleting,
    deleteError,
  } = useChampionshipWizardCancel(wizard)

  const seasons = seasonList.query.data ?? []
  const categories = categoryList.query.data ?? []
  const selectedSeason = seasons.find(s => s.id === wizard.seasonId) ?? null
  const selectedCategory = categories.find(c => c.id === wizard.categoryId) ?? null
  const categoryTeams = teamOptions.filter(t => t.ageCategoryId === wizard.categoryId)

  const summaryLines = useChampionshipWizardSummary(wizard, intl, selectedSeason, selectedCategory)

  const isLastStep = wizard.step === LAST_STEP

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="championshipWizard.title" />
          </Typography.Title1>
          <Button variant="outline" onPress={handleCancelPress}>
            <FormattedMessage id="championshipWizard.cancel.button" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <ConfirmCancelWizardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onDeletePermanently={handleDeletePermanently}
        onKeepForLater={handleKeepForLater}
        isDeleting={isDeleting}
      />
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
              {wizard.step === 5 && wizard.phaseType === PhaseType.GROUP && (
                <StepConfigGroup
                  teams={categoryTeams}
                  groups={wizard.groups}
                  onSetMatchMode={wizard.setGroupMatchMode}
                  onGenerate={groupId => wizard.setGroupGenerated(groupId, true)}
                  points={wizard.points}
                  onStepPoints={wizard.stepper}
                  maxRank={wizard.maxRank}
                  onMaxRankChange={wizard.setMaxRank}
                />
              )}
              {wizard.step === 5 && wizard.phaseType === PhaseType.KNOCKOUT && (
                <StepConfigKnockout teams={categoryTeams} teamIds={wizard.teamIds} />
              )}

              {createChampionshipError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.createFailed" />
                </Typography.Body>
              )}
              {createPhaseError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.createPhaseFailed" />
                </Typography.Body>
              )}
              {submitError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.submitFailed" />
                </Typography.Body>
              )}
              {deleteError && (
                <Typography.Body className="text-destructive">
                  <FormattedMessage id="championshipWizard.error.deleteFailed" />
                </Typography.Body>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onPress={wizard.back} isDisabled={wizard.step === 0}>
                  <FormattedMessage id="championshipWizard.action.previous" />
                </Button>
                {isLastStep ? (
                  <Button variant="default" onPress={handleSubmit} isDisabled={!wizard.canNext || isSubmitting}>
                    <FormattedMessage id="championshipWizard.action.create" />
                  </Button>
                ) : (
                  <Button variant="outline" onPress={handleNext} isDisabled={!wizard.canNext || isNextPending}>
                    <FormattedMessage id="championshipWizard.action.next" />
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card.Container>

          <WizardSummary lines={summaryLines} onJump={wizard.goTo} />
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}
