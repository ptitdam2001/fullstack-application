import * as React from 'react'
import { Separator } from 'react-aria-components'

import { cn } from '../../utils/cn'

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

export { DropdownMenuSeparator }
