import React from 'react'
import { className as cn } from '@Common/utils/className'

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn('table-header-group', className)} {...props}>
      <tr className="table-row border-b">{children}</tr>
    </thead>
  )
)
TableHeader.displayName = 'TableHeader'
