import * as React from 'react'
import { Header } from 'react-aria-components'

import { cn } from '../../utils/cn'

type DropdownMenuLabelProps = React.ComponentProps<typeof Header> & {
  inset?: boolean
}

function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabelProps) {
  return (
    <Header
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
      {...props}
    />
  )
}

export { DropdownMenuLabel }
