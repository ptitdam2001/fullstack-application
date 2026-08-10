import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, cn } from '@repo/design-system'
import type { Team } from '@Teams/domain/Team'
import { MatchMode } from '../../domain/Group'
import type { PointsConfig } from '../../domain/Championship'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'
import { roundRobin } from '../../application/roundRobin'

type StepConfigGroupProps = {
  teams: Team[]
  groups: ChampionshipWizardGroup[]
  onSetMatchMode: (groupId: string, matchMode: MatchMode) => void
  onGenerate: (groupId: string) => void
  points: PointsConfig
  onStepPoints: (key: keyof PointsConfig, delta: number) => void
  maxRank: number
  onMaxRankChange: (maxRank: number) => void
}

type StepperProps = {
  value: number
  onDecrement: () => void
  onIncrement: () => void
  decrementLabel: string
  incrementLabel: string
}

const Stepper = ({ value, onDecrement, onIncrement, decrementLabel, incrementLabel }: StepperProps) => (
  <div className="flex items-center gap-2.5">
    <button
      type="button"
      aria-label={decrementLabel}
      onClick={onDecrement}
      className="border-border hover:bg-secondary flex h-6.5 w-6.5 items-center justify-center rounded border text-sm"
    >
      –
    </button>
    <span className="w-5 text-center text-sm font-semibold">{value}</span>
    <button
      type="button"
      aria-label={incrementLabel}
      onClick={onIncrement}
      className="border-border hover:bg-secondary flex h-6.5 w-6.5 items-center justify-center rounded border text-sm"
    >
      +
    </button>
  </div>
)

const POINT_ROWS: { key: keyof PointsConfig; labelId: string; subId: string }[] = [
  {
    key: 'win',
    labelId: 'championshipWizard.step.configGroup.points.win',
    subId: 'championshipWizard.step.configGroup.points.win.sub',
  },
  {
    key: 'draw',
    labelId: 'championshipWizard.step.configGroup.points.draw',
    subId: 'championshipWizard.step.configGroup.points.draw.sub',
  },
  {
    key: 'loss',
    labelId: 'championshipWizard.step.configGroup.points.loss',
    subId: 'championshipWizard.step.configGroup.points.loss.sub',
  },
  {
    key: 'forfeit',
    labelId: 'championshipWizard.step.configGroup.points.forfeit',
    subId: 'championshipWizard.step.configGroup.points.forfeit.sub',
  },
]

export const StepConfigGroup = ({
  teams,
  groups,
  onSetMatchMode,
  onGenerate,
  points,
  onStepPoints,
  maxRank,
  onMaxRankChange,
}: StepConfigGroupProps) => {
  const intl = useIntl()
  const decrementLabel = intl.formatMessage({ id: 'championshipWizard.step.configGroup.stepper.decrement' })
  const incrementLabel = intl.formatMessage({ id: 'championshipWizard.step.configGroup.stepper.increment' })

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.configGroup" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.configGroup.hint" />
      </Typography.Body>

      <div className="flex flex-col gap-4">
        {groups.map(group => {
          const matches = group.generated ? roundRobin(group.teamIds, group.matchMode) : []
          const canGenerate = group.teamIds.length >= 2

          return (
            <div key={group.id} className="border-border overflow-hidden rounded-lg border">
              <div className="bg-secondary flex flex-wrap items-center gap-3 p-3">
                <span className="mr-auto text-sm font-semibold">{group.name}</span>
                <span className="text-muted-foreground text-xs">
                  <FormattedMessage
                    id="championshipWizard.step.teamsGroups.teamCount"
                    values={{ count: group.teamIds.length }}
                  />
                </span>
                <div className="border-border inline-flex overflow-hidden rounded-md border">
                  <button
                    type="button"
                    onClick={() => onSetMatchMode(group.id, MatchMode.SINGLE)}
                    className={cn(
                      'border-border border-r px-3 py-1.5 text-xs font-medium',
                      group.matchMode === MatchMode.SINGLE && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <FormattedMessage id="championshipWizard.step.configGroup.matchMode.single" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetMatchMode(group.id, MatchMode.HOME_AND_AWAY)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium',
                      group.matchMode === MatchMode.HOME_AND_AWAY && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <FormattedMessage id="championshipWizard.step.configGroup.matchMode.homeAndAway" />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={() => onGenerate(group.id)}
                  className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FormattedMessage id="championshipWizard.step.configGroup.generate" />
                </button>
              </div>

              <div>
                <div className="bg-secondary border-border flex items-center justify-between border-b px-3 py-2 text-xs font-semibold">
                  <span>
                    <FormattedMessage id="championshipWizard.step.configGroup.previewTitle" />
                  </span>
                  <span>
                    <FormattedMessage
                      id="championshipWizard.step.configGroup.previewCount"
                      values={{ count: matches.length }}
                    />
                  </span>
                </div>
                {matches.length === 0 ? (
                  <div className="text-muted-foreground p-4 text-center text-xs">
                    <FormattedMessage
                      id={
                        canGenerate
                          ? 'championshipWizard.step.configGroup.previewEmptyNotGenerated'
                          : 'championshipWizard.step.configGroup.previewEmptyNoTeams'
                      }
                    />
                  </div>
                ) : (
                  matches.map((match, index) => (
                    <div
                      key={index}
                      className="border-border grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 border-b px-3 py-2 text-sm last:border-b-0"
                    >
                      <span className="text-right font-medium">{teams.find(t => t.id === match.homeTeamId)?.name}</span>
                      <span className="text-muted-foreground text-xs">
                        <FormattedMessage id="championshipWizard.step.configGroup.vs" />
                      </span>
                      <span className="font-medium">{teams.find(t => t.id === match.awayTeamId)?.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Typography.Title3 className="mt-6 mb-2.5">
        <FormattedMessage id="championshipWizard.step.configGroup.pointsTitle" />
      </Typography.Title3>
      <div className="border-border overflow-hidden rounded-lg border">
        {POINT_ROWS.map((row, index) => (
          <div
            key={row.key}
            className={cn('border-border grid grid-cols-2 items-center', index < POINT_ROWS.length - 1 && 'border-b')}
          >
            <div className="p-3">
              <div className="text-sm font-medium">
                <FormattedMessage id={row.labelId} />
              </div>
              <div className="text-muted-foreground text-xs">
                <FormattedMessage id={row.subId} />
              </div>
            </div>
            <div className="p-3">
              <Stepper
                value={points[row.key]}
                onDecrement={() => onStepPoints(row.key, -1)}
                onIncrement={() => onStepPoints(row.key, 1)}
                decrementLabel={decrementLabel}
                incrementLabel={incrementLabel}
              />
            </div>
          </div>
        ))}
      </div>

      <Typography.Title3 className="mt-6 mb-2.5">
        <FormattedMessage id="championshipWizard.step.configGroup.qualificationTitle" />
      </Typography.Title3>
      <div className="border-border bg-secondary flex items-center gap-4 rounded-lg border p-4">
        <span className="flex-1 text-sm leading-relaxed">
          <FormattedMessage
            id={
              maxRank === 1
                ? 'championshipWizard.step.configGroup.qualification.explanationSingle'
                : 'championshipWizard.step.configGroup.qualification.explanationMulti'
            }
            values={{ maxRank }}
          />
        </span>
        <Stepper
          value={maxRank}
          onDecrement={() => onMaxRankChange(Math.max(1, maxRank - 1))}
          onIncrement={() => onMaxRankChange(maxRank + 1)}
          decrementLabel={intl.formatMessage({
            id: 'championshipWizard.step.configGroup.qualification.stepper.decrement',
          })}
          incrementLabel={intl.formatMessage({
            id: 'championshipWizard.step.configGroup.qualification.stepper.increment',
          })}
        />
      </div>
    </div>
  )
}
