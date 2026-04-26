import React from 'react'
import { cn } from '@repo/design-system'

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  )
)
TableCaption.displayName = 'TableCaption'
