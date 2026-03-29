import * as React from 'react'
import { Menu, Popover } from 'react-aria-components'

import { cn } from '../../utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

function buildPlacement(side?: Side, align?: Align): React.ComponentProps<typeof Popover>['placement'] {
  if (!side) return undefined
  if (!align || align === 'center') return side
  return `${side} ${align}` as React.ComponentProps<typeof Popover>['placement']
}

type DropdownMenuContentProps = React.ComponentProps<typeof Menu> & {
  sideOffset?: number
  side?: Side
  align?: Align
}

function DropdownMenuContent({ className, sideOffset = 4, side, align, children, ...props }: DropdownMenuContentProps) {
  return (
    <Popover
      offset={sideOffset}
      placement={buildPlacement(side, align)}
      className={cn(
        'bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
        className
      )}
    >
      <Menu data-slot="dropdown-menu-content" className="outline-none" {...props}>
        {children}
      </Menu>
    </Popover>
  )
}

export { DropdownMenuContent }
