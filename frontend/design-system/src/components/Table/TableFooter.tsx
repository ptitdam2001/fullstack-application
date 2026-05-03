import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => (
  <tfoot
    data-slot="table-footer"
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
)
