import { Column, type ColumnProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableHead = ({ className, ...props }: ColumnProps) => (
  <Column
    data-slot="table-head"
    className={cn('text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap', className)}
    {...props}
  />
)
