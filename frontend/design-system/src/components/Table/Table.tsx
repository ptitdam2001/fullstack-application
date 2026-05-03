import * as React from 'react'

import { cn } from '../../utils/cn'

export const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
  <div className="relative w-full overflow-auto">
    <table
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
)
