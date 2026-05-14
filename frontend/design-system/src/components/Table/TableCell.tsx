import * as React from 'react'
import { Cell, type CellProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableCell = ({ className, ...props }: CellProps) => (
  <Cell
    data-slot="table-cell"
    className={cn('p-2 align-middle whitespace-nowrap', className)}
    {...props}
  />
)
