import * as React from 'react'
import { DialogTrigger } from 'react-aria-components'

type PopoverProps = Omit<React.ComponentProps<typeof DialogTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Popover({ open, defaultOpen, onOpenChange, ...props }: PopoverProps) {
  return (
    <DialogTrigger
      data-slot="popover"
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

export { Popover }
