import React from 'react'
import { className as cn } from '@Common/utils/className'
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
