import React from 'react'
import { cn } from '@repo/design-system'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted table-row border-b outline-0 transition-colors',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'
