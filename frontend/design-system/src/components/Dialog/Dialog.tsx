import * as React from 'react'
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components'

type DialogProps = Omit<React.ComponentProps<typeof AriaDialogTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

function Dialog({ open, defaultOpen, onOpenChange, modal: _modal, ...props }: DialogProps) {
  return (
    <AriaDialogTrigger
      data-slot="dialog"
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

export { Dialog }
