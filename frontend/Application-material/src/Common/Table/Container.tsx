import * as React from 'react'

import { className as cn } from '@Common/utils/className'
import { TableProvider } from './TableContext'

export const TableContainer = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <TableProvider.Provider>
      <div className="relative w-full overflow-auto scrollbar-thin">
        <table ref={ref} className={cn('table outline-0 w-full caption-bottom', className)} {...props} />
      </div>
    </TableProvider.Provider>
  )
)
TableContainer.displayName = 'Table'
