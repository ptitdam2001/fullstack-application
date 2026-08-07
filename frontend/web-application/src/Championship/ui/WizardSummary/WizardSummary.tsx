import { FormattedMessage } from 'react-intl'
import { cn } from '@repo/design-system'

type WizardSummaryLine = {
  key: string
  labelId: string
  value: string | null
}

type WizardSummaryProps = {
  lines: WizardSummaryLine[]
  onJump: (index: number) => void
}

export const WizardSummary = ({ lines, onJump }: WizardSummaryProps) => (
  <aside className="border-border bg-card sticky top-20 flex flex-col gap-0.5 rounded-lg border p-4">
    <h5 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
      <FormattedMessage id="championshipWizard.summary.title" />
    </h5>
    {lines.map((line, index) => (
      <button
        key={line.key}
        type="button"
        onClick={() => onJump(index)}
        className="border-border hover:bg-secondary flex items-center justify-between gap-2 rounded-md border-b py-2 text-left text-xs last:border-b-0"
      >
        <span className="text-muted-foreground">
          <FormattedMessage id={line.labelId} />
        </span>
        <span
          className={cn('max-w-[140px] truncate font-semibold', !line.value && 'text-muted-foreground font-normal')}
        >
          {line.value ?? '—'}
        </span>
      </button>
    ))}
  </aside>
)
