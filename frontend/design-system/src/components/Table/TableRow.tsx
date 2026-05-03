import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr
    data-slot="table-row"
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
)
