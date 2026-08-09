import { FormattedMessage } from 'react-intl'
import { Typography, cn } from '@repo/design-system'
import { PhaseType } from '../../domain/Phase'

type StepPhaseProps = {
  phaseType: PhaseType | null
  onSelect: (phaseType: PhaseType) => void
}

const OPTIONS = [
  { type: PhaseType.GROUP, labelId: 'championshipWizard.phaseType.GROUP', descId: 'championshipWizard.step.phase.groupDesc' },
  {
    type: PhaseType.KNOCKOUT,
    labelId: 'championshipWizard.phaseType.KNOCKOUT',
    descId: 'championshipWizard.step.phase.knockoutDesc',
  },
] as const

export const StepPhase = ({ phaseType, onSelect }: StepPhaseProps) => (
  <div>
    <Typography.Title2>
      <FormattedMessage id="championshipWizard.step.phase" />
    </Typography.Title2>
    <Typography.Body className="text-muted-foreground mb-5">
      <FormattedMessage id="championshipWizard.step.phase.hint" />
    </Typography.Body>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {OPTIONS.map(option => {
        const selected = option.type === phaseType
        return (
          <button
            key={option.type}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option.type)}
            className={cn(
              'border-border flex flex-col gap-1 rounded-lg border p-4 text-left',
              'hover:bg-secondary',
              selected && 'border-primary bg-secondary'
            )}
          >
            <span className="text-sm font-semibold">
              <FormattedMessage id={option.labelId} />
            </span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              <FormattedMessage id={option.descId} />
            </span>
          </button>
        )
      })}
    </div>
  </div>
)
