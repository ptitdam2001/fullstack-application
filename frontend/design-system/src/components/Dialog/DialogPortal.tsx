import * as React from 'react'

/**
 * No-op passthrough — react-aria-components' Modal handles portaling internally.
 * Kept for backward compatibility with existing consumers.
 */
function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export { DialogPortal }
