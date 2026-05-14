import * as React from 'react'
import { TableBody as AriaTableBody, type TableBodyProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableBody = <T extends object>({ className, ...props }: TableBodyProps<T>) => (
  <AriaTableBody
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
)
