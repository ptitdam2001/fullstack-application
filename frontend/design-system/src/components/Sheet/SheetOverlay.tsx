import * as React from 'react'

import { cn } from '../../utils/cn'

function SheetOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-overlay"
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      {...props}
    />
  )
}

export { SheetOverlay }
