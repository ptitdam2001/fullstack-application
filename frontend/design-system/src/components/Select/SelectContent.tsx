import * as React from 'react'
import { ListBox, Popover } from 'react-aria-components'

import { cn } from '../../utils/cn'

type SelectContentProps = React.ComponentProps<typeof ListBox> & {
  sideOffset?: number
}

export const SelectContent = ({ className, sideOffset = 4, children, ...props }: SelectContentProps) => (
  <Popover
    offset={sideOffset}
    className="bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-top:slide-in-from-bottom-2 z-50 min-w-[var(--trigger-width)] overflow-hidden rounded-md border shadow-md"
  >
    <ListBox
      data-slot="select-content"
      className={cn('max-h-60 overflow-y-auto p-1 outline-none', className)}
      {...props}
    >
      {children}
    </ListBox>
  </Popover>
)
