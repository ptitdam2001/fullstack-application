import * as React from 'react'
import { MenuItem } from 'react-aria-components'

import { cn } from '../../utils/cn'

type DropdownMenuItemProps = React.ComponentProps<typeof MenuItem> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

function DropdownMenuItem({ className, inset, variant = 'default', disabled, isDisabled, ...props }: DropdownMenuItemProps) {
  return (
    <MenuItem
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      isDisabled={isDisabled ?? disabled}
      className={cn(
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[focused]:bg-destructive/10 dark:data-[variant=destructive]:data-[focused]:bg-destructive/20 data-[variant=destructive]:data-[focused]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { DropdownMenuItem }
