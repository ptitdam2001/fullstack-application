import React from 'react'
import { className as cn } from '@Common/utils/className'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('table-row-group [&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'
