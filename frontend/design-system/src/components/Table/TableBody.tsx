import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
)
