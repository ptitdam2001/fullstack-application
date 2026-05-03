import * as React from 'react'

import { cn } from '../../utils/cn'

export const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
  <thead
    data-slot="table-header"
    className={cn('[&_tr]:border-b', className)}
    {...props}
  />
)
