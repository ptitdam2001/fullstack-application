import * as React from 'react'

/**
 * No-op passthrough — react-aria-components does not require a provider.
 * Kept for backward compatibility with existing consumers.
 */
function TooltipProvider({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
  void props
  return <>{children}</>
}

export { TooltipProvider }
