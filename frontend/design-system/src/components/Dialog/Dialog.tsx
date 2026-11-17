import * as React from 'react'
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components'

type DialogProps = Omit<React.ComponentProps<typeof AriaDialogTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({ open, defaultOpen, onOpenChange, ...props }: DialogProps) {
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
