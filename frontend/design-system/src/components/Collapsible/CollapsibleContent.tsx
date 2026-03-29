import * as React from 'react'

import { useCollapsibleContext } from './CollapsibleContext'

type CollapsibleContentProps = React.ComponentProps<'div'>

function CollapsibleContent({ children, ...props }: CollapsibleContentProps) {
  const { open, contentId } = useCollapsibleContext()

  if (!open) return null

  return (
    <div
      id={contentId}
      data-slot="collapsible-content"
      data-state={open ? 'open' : 'closed'}
      {...props}
    >
      {children}
    </div>
  )
}

export { CollapsibleContent }
