import * as React from 'react'
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components'

type SheetProps = Omit<React.ComponentProps<typeof AriaDialogTrigger>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Sheet({ open, defaultOpen, onOpenChange, ...props }: SheetProps) {
  return (
    <AriaDialogTrigger
      data-slot="sheet"
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

export { Sheet }
