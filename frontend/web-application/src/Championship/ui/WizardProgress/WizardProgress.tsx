import { FormattedMessage } from 'react-intl'
import { cn } from '@repo/design-system'
import { WIZARD_STEPS } from '../../application/useChampionshipWizard'

type WizardProgressProps = {
  currentStep: number
  canGoNext: boolean
  onStepClick: (step: number) => void
}

export const WizardProgress = ({ currentStep, canGoNext, onStepClick }: WizardProgressProps) => (
  <div className="flex gap-2">
    {WIZARD_STEPS.map((s, i) => {
      const done = i < currentStep
      const current = i === currentStep
      const clickable = i <= currentStep || (i === currentStep + 1 && canGoNext)

      return (
        <button
          key={s.key}
          type="button"
          disabled={!clickable}
          onClick={() => onStepClick(i)}
          className="flex flex-1 flex-col gap-1.5 text-left disabled:cursor-default"
        >
          <span className={cn('bg-border h-1 rounded-full', (done || current) && 'bg-primary')} />
          <span className={cn('text-muted-foreground text-xs font-medium', current && 'text-foreground')}>
            <span>{s.num}. </span>
            <span>
              <FormattedMessage id={s.labelId} />
            </span>
          </span>
        </button>
      )
    })}
  </div>
)
