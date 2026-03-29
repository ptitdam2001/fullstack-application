import * as React from 'react'

import { Slot } from '../../utils/Slot'
import { CollapsibleContext } from './CollapsibleContext'

type CollapsibleProps = React.ComponentProps<'div'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  asChild?: boolean
}

function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  asChild = false,
  children,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const contentId = React.useId()

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  const Comp = asChild ? Slot : 'div'

  return (
    <CollapsibleContext.Provider value={{ open: isOpen!, setOpen: handleOpenChange, contentId }}>
      <Comp
        data-slot="collapsible"
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </Comp>
    </CollapsibleContext.Provider>
  )
}

export { Collapsible }
