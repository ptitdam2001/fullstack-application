import { ProgressBar, Label } from 'react-aria-components'
import type { ProgressBarProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type ProgressProps = Omit<ProgressBarProps, 'children'> & {
  label?: string
  showValue?: boolean
}

export const Progress = ({ label, showValue = false, className, ...props }: ProgressProps) => (
  <ProgressBar
    data-slot="progress"
    className={cn('flex flex-col gap-2', className)}
    {...props}
  >
    {({ percentage, valueText }) => (
      <>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <Label className="text-sm font-medium">{label}</Label>}
            {showValue && (
              <span className="text-muted-foreground text-sm tabular-nums">{valueText}</span>
            )}
          </div>
        )}
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage ?? 0}%` }}
          />
        </div>
      </>
    )}
  </ProgressBar>
)
