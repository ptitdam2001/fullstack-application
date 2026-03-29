import * as React from 'react'
import { Menu, Popover } from 'react-aria-components'

import { cn } from '../../utils/cn'

function DropdownMenuSubContent({ className, children, ...props }: React.ComponentProps<typeof Menu>) {
  return (
    <Popover
      className={cn(
        'bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
        className
      )}
    >
      <Menu data-slot="dropdown-menu-sub-content" className="outline-none" {...props}>
        {children}
      </Menu>
    </Popover>
  )
}

export { DropdownMenuSubContent }
