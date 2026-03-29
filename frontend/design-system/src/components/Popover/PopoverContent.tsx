import * as React from 'react'
import { Popover as AriaPopover, Dialog } from 'react-aria-components'

import { cn } from '../../utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

function buildPlacement(
  side: Side = 'bottom',
  align: Align = 'center'
): React.ComponentProps<typeof AriaPopover>['placement'] {
  if (align === 'center') return side
  return `${side} ${align}` as React.ComponentProps<typeof AriaPopover>['placement']
}

type PopoverContentProps = Omit<React.ComponentProps<typeof AriaPopover>, 'placement' | 'offset' | 'children'> & {
  align?: Align
  side?: Side
  sideOffset?: number
  alignOffset?: number
  children?: React.ReactNode
  forceMount?: boolean
}

function PopoverContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  forceMount: _forceMount,
  ...props
}: PopoverContentProps) {
  return (
    <AriaPopover
      data-slot="popover-content"
      placement={buildPlacement(side, align)}
      offset={sideOffset}
      className={cn(
        'bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden',
        className
      )}
      {...props}
    >
      <Dialog className="outline-none">{children}</Dialog>
    </AriaPopover>
  )
}

export { PopoverContent }
