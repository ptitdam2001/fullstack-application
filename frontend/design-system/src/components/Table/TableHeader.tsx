import * as React from 'react'
import { TableHeader as AriaTableHeader, type TableHeaderProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableHeader = <T extends object>({ className, ...props }: TableHeaderProps<T>) => (
  <AriaTableHeader
    data-slot="table-header"
    className={cn('[&_tr]:border-b', className)}
    {...props}
  />
)
