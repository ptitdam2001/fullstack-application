import * as React from 'react'

/**
 * Passes children through as the trigger element.
 * react-aria-components' DialogTrigger identifies the first focusable child
 * as the trigger automatically.
 */
function PopoverTrigger({ asChild: _asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <>{children}</>
}

export { PopoverTrigger }
