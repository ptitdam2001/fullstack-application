import { Radio as AriaRadio, composeRenderProps } from 'react-aria-components'
import type { RadioProps as AriaRadioProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type RadioProps = Omit<AriaRadioProps, 'children'> & { children?: React.ReactNode }

export const Radio = ({ className, children, ...props }: RadioProps) => (
  <AriaRadio
    data-slot="radio"
    className={composeRenderProps(className, cls =>
      cn('group flex cursor-pointer items-center gap-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50', cls)
    )}
    {...props}
  >
    <>
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border border-input shadow-xs transition-colors',
          'group-data-[selected]:border-primary',
          'group-data-[focus-visible]:ring-ring/50 group-data-[focus-visible]:ring-[3px]',
          'group-data-[invalid]:border-destructive',
        )}
        aria-hidden
      >
        <span
          className={cn(
            'size-2 rounded-full bg-transparent transition-colors',
            'group-data-[selected]:bg-primary',
          )}
        />
      </span>
      {children}
    </>
  </AriaRadio>
)
