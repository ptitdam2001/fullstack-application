import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th
    data-slot="table-head"
    className={cn(
      'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
)
