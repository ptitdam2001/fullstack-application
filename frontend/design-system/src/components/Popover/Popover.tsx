import * as React from 'react'
import { DialogTrigger } from 'react-aria-components'

type PopoverProps = Omit<React.ComponentProps<typeof DialogTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Popover = ({ open, defaultOpen, onOpenChange, ...props }: PopoverProps) => (
  <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} {...props} />
)
