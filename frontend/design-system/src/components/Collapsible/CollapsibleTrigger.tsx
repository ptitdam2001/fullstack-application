import * as React from 'react'
import { useCollapsibleContext } from './CollapsibleContext'

type CollapsibleTriggerProps = React.ComponentProps<'button'>

function CollapsibleTrigger({ onClick, children, ...props }: CollapsibleTriggerProps) {
  const { open, setOpen, contentId } = useCollapsibleContext()

  return (
    <button
      data-slot="collapsible-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(e) => {
        setOpen(!open)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export { CollapsibleTrigger }
