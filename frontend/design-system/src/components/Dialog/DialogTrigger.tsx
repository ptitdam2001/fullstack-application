import * as React from 'react'

/**
 * Passes children through as the trigger element.
 * react-aria-components' DialogTrigger identifies the first focusable child
 * as the trigger automatically. The `asChild` prop is accepted for backward
 * compatibility but has no effect.
 */
function DialogTrigger({ asChild: _asChild, children }: { asChild?: boolean; children?: React.ReactNode }) {
  return <>{children}</>
}

export { DialogTrigger }
