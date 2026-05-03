import { Switch as AriaSwitch, composeRenderProps } from 'react-aria-components'
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type SwitchProps = Omit<AriaSwitchProps, 'children'> & { children?: React.ReactNode }

export const Switch = ({ className, children, ...props }: SwitchProps) => (
  <AriaSwitch
    data-slot="switch"
    className={composeRenderProps(className, cls =>
      cn('group flex cursor-pointer items-center gap-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50', cls)
    )}
    {...props}
  >
    <>
      <div
        className={cn(
          'inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input shadow-xs transition-colors',
          'group-data-[selected]:bg-primary',
          'group-data-[focus-visible]:ring-ring/50 group-data-[focus-visible]:ring-[3px]',
        )}
      >
        <span
          className={cn(
            'bg-background pointer-events-none block size-4 rounded-full shadow-sm ring-0 transition-transform',
            'translate-x-0 group-data-[selected]:translate-x-4',
          )}
        />
      </div>
      {children}
    </>
  </AriaSwitch>
)
