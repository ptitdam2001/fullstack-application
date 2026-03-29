import * as React from 'react'

import { cn } from '../../utils/cn'

/**
 * Kept for backward compatibility. DialogContent now handles its own overlay
 * via react-aria-components' ModalOverlay internally.
 */
function DialogOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-overlay"
      className={cn('fixed inset-0 z-50 bg-black/80', className)}
      {...props}
    />
  )
}

export { DialogOverlay }
