import { Table as AriaTable, type TableProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const Table = ({ className, ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <AriaTable
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
)
