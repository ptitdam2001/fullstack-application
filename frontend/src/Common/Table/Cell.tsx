import React from 'react'
import { className as cn } from '@Common/utils/className'

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  className?: string
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'table-cell p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'
