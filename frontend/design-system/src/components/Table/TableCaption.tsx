import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => (
  <caption
    data-slot="table-caption"
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...props}
  />
)
