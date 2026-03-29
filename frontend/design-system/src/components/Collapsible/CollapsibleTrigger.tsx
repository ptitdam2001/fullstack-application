import * as React from 'react'

import { Slot } from '../../utils/Slot'
import { useCollapsibleContext } from './CollapsibleContext'

type CollapsibleTriggerProps = React.ComponentProps<'button'> & {
  asChild?: boolean
}

function CollapsibleTrigger({ asChild = false, onClick, children, ...props }: CollapsibleTriggerProps) {
  const { open, setOpen, contentId } = useCollapsibleContext()
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="collapsible-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(!open)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { CollapsibleTrigger }
