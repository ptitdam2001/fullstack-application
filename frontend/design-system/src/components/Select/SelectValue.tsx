import * as React from 'react'
import { SelectValue as AriaSelectValue } from 'react-aria-components'

import { cn } from '../../utils/cn'

type SelectValueProps<T extends object> = React.ComponentProps<typeof AriaSelectValue<T>>

export const SelectValue = <T extends object>({ className, ...props }: SelectValueProps<T>) => (
  <AriaSelectValue
    data-slot="select-value"
    className={cn('flex-1 truncate text-left', className)}
    {...props}
  />
)
