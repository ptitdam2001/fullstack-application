import * as React from 'react'
import { DisclosurePanel, DisclosureStateContext } from 'react-aria-components'

import { cn } from '../../utils/cn'

type CollapsibleContentProps = Omit<React.ComponentProps<typeof DisclosurePanel>, 'children'> & {
  children?: React.ReactNode
}

/**
 * Reads DisclosureStateContext and sets data-state on the closest
 * [data-slot="collapsible-content"] ancestor. Renders a hidden span
 * so it can get a DOM ref to walk up the tree.
 */
const PanelStateSync = () => {
  const state = React.useContext(DisclosureStateContext)
  const isExpanded = state?.isExpanded ?? false

  const syncRef = React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node) return
      const panel = node.closest('[data-slot="collapsible-content"]')
      if (panel) {
        panel.setAttribute('data-state', isExpanded ? 'open' : 'closed')
      }
    },
    [isExpanded]
  )

  return <span ref={syncRef} aria-hidden style={{ display: 'none' }} />
}

export const CollapsibleContent = ({ className, children, ...props }: CollapsibleContentProps) => (
  <DisclosurePanel
    data-slot="collapsible-content"
    className={cn(className)}
    {...props}
  >
    <PanelStateSync />
    {children}
  </DisclosurePanel>
)

CollapsibleContent.displayName = 'CollapsibleContent'
