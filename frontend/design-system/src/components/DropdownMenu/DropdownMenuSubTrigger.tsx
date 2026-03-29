import * as React from 'react'
import { MenuItem } from 'react-aria-components'
import { ChevronRightIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

type DropdownMenuSubTriggerProps = Omit<React.ComponentProps<typeof MenuItem>, 'children'> & {
  inset?: boolean
  children?: React.ReactNode
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: DropdownMenuSubTriggerProps) {
  return (
    <MenuItem
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[open]:bg-accent data-[open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuItem>
  )
}

export { DropdownMenuSubTrigger }
