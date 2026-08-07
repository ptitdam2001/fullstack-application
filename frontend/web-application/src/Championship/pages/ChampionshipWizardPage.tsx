import { FormattedMessage, useIntl, type IntlShape } from 'react-intl'
import { Button, Card, Layout, Separator, Typography } from '@repo/design-system'
import { useChampionshipWizard, WIZARD_STEPS, type ChampionshipWizardGroup } from '../application/useChampionshipWizard'
import { PhaseType } from '../domain/Phase'
import { WizardProgress } from '../ui/WizardProgress/WizardProgress'
import { WizardSummary } from '../ui/WizardSummary/WizardSummary'

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

  const teamsValue = formatTeamsValue(intl, wizard.phaseType, wizard.groups, wizard.teamIds)

  const configValue =
    wizard.phaseType === PhaseType.GROUP && wizard.groups.some(g => g.generated)
      ? intl.formatMessage(
          { id: 'championshipWizard.summary.configGroupValue' },
          { generatedCount: wizard.groups.filter(g => g.generated).length, groupCount: wizard.groups.length }
        )
      : null

  const summaryLines = [
    { key: 'season', labelId: 'championshipWizard.summary.season', value: wizard.seasonId },
    { key: 'category', labelId: 'championshipWizard.summary.category', value: wizard.categoryId },
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
              <Typography.Title2>
                <FormattedMessage id={WIZARD_STEPS[wizard.step].labelId} />
              </Typography.Title2>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onPress={wizard.back} isDisabled={wizard.step === 0}>
                  <FormattedMessage id="championshipWizard.action.previous" />
                </Button>
                <Button variant="outline" onPress={wizard.next} isDisabled={!wizard.canNext}>
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
