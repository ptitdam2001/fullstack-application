import React from 'react'
import { cn } from '@repo/design-system'
import { TableProvider } from './TableContext'

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, className, ...props }, ref) => {
    const { cells } = TableProvider.useValue()
    return (
      <tfoot
        ref={ref}
        className={cn('table-footer-group border-t font-medium last:[&>tr]:border-b-0', className)}
        {...props}
      >
        <tr className="table-row">
          <td colSpan={cells.length} className="table-cell">
            {children}
          </td>
        </tr>
      </tfoot>
    )
  }
)
TableFooter.displayName = 'TableFooter'
