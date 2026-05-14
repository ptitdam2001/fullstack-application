import * as React from 'react'
import { Disclosure, DisclosureStateContext } from 'react-aria-components'

import { cn } from '../../utils/cn'

type CollapsibleProps = Omit<
  React.ComponentProps<typeof Disclosure>,
  'isExpanded' | 'defaultExpanded' | 'onExpandedChange' | 'isDisabled' | 'children'
> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children?: React.ReactNode
}

/** Syncs data-state="open|closed" onto the nearest [data-slot="collapsible"] ancestor. */
const DataStateSync = () => {
  const state = React.useContext(DisclosureStateContext)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const parent = ref.current?.closest('[data-slot="collapsible"]')
    if (parent) {
      parent.setAttribute('data-state', state?.isExpanded ? 'open' : 'closed')
    }
  })

  return <span ref={ref} data-state-sync="" aria-hidden style={{ display: 'none' }} />
}

export const Collapsible = ({ open, defaultOpen, onOpenChange, disabled, className, children, ...props }: CollapsibleProps) => (
  <Disclosure
    data-slot="collapsible"
    isExpanded={open}
    defaultExpanded={defaultOpen}
    onExpandedChange={onOpenChange}
    isDisabled={disabled}
    className={cn(className)}
    {...props}
  >
    <DataStateSync />
    {children}
  </Disclosure>
)

Collapsible.displayName = 'Collapsible'
