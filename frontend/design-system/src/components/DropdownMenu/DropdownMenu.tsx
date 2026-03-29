import * as React from 'react'
import { MenuTrigger } from 'react-aria-components'

type DropdownMenuProps = Omit<React.ComponentProps<typeof MenuTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function DropdownMenu({ open, defaultOpen, onOpenChange, ...props }: DropdownMenuProps) {
  return (
    <MenuTrigger
      data-slot="dropdown-menu"
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

export { DropdownMenu }
