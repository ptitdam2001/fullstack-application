import * as React from 'react'

import { className as cn } from '@Common/utils/className'

export const TableContainer = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
TableContainer.displayName = 'Table'
