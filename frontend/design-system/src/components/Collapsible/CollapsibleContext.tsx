import * as React from 'react'

type CollapsibleContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext() {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error('Collapsible sub-components must be used within <Collapsible>')
  return ctx
}

export { CollapsibleContext, useCollapsibleContext }
