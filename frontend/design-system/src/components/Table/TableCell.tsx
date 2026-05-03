import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td
    data-slot="table-cell"
    className={cn(
      'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
)
