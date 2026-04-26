import * as React from 'react'

import { cn } from '@repo/design-system'
import { TableProvider } from './TableContext'

export const TableContainer = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <TableProvider.Provider value={{ cells: [] }}>
      <div className="scrollbar-thin relative w-full overflow-auto">
        <table ref={ref} className={cn('table w-full caption-bottom outline-0', className)} {...props} />
      </div>
    </TableProvider.Provider>
  )
)
TableContainer.displayName = 'Table'
