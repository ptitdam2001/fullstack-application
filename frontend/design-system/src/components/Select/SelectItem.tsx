import * as React from 'react'
import { ListBoxItem } from 'react-aria-components'

import { cn } from '../../utils/cn'

type SelectItemProps = React.ComponentProps<typeof ListBoxItem>

export const SelectItem = ({ className, ...props }: SelectItemProps) => (
  <ListBoxItem
    data-slot="select-item"
    className={cn(
      'relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      'data-focused:bg-accent data-focused:text-accent-foreground',
      'data-selected:font-medium',
      className
    )}
    {...props}
  />
)
