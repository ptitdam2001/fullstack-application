import * as React from 'react'

/**
 * Renders its children as-is — react-aria-components' TooltipTrigger
 * automatically treats the first focusable child as the trigger element.
 * The `asChild` prop is accepted for backward compatibility but has no effect.
 */
function TooltipTrigger({
  asChild: _asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactNode
}) {
  return <>{children}</>
}

export { TooltipTrigger }
