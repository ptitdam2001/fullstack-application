import * as React from 'react'
import { Dialog, Popover as AriaPopover } from 'react-aria-components'

import { cn } from '../../utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

const buildPlacement = (
  side: Side = 'bottom',
  align: Align = 'center'
): React.ComponentProps<typeof AriaPopover>['placement'] =>
  (align === 'center' ? side : `${side} ${align}`) as React.ComponentProps<typeof AriaPopover>['placement']

type PopoverContentProps = Omit<React.ComponentProps<typeof AriaPopover>, 'placement' | 'offset'> & {
  side?: Side
  align?: Align
  sideOffset?: number
  children?: React.ReactNode
}

// isOpen, onOpenChange, and triggerRef are read from DialogTrigger's context
// automatically — no need to pass them explicitly.
export const PopoverContent = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  ...props
}: PopoverContentProps) => (
  <AriaPopover
    data-slot="popover-content"
    placement={buildPlacement(side, align)}
    offset={sideOffset}
    className={cn(
      'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden',
      'entering:animate-in entering:fade-in-0 entering:zoom-in-95',
      'exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95',
      'placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2',
      'placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2',
      className
    )}
    {...props}
  >
    <Dialog className="outline-none">{children}</Dialog>
  </AriaPopover>
)
