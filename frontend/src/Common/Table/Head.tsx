import React from 'react'
import { className as cn } from '@Common/utils/className'
import { TableProvider } from './TableContext'
import { v4 as uuid } from 'uuid'

type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  size?: string
  className?: string
  style?: React.CSSProperties
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, style, size = '100%', ...props }, ref) => {
    const [id] = React.useState(uuid())
    const dispatchTable = TableProvider.useDispatch()

    React.useEffect(() => {
      dispatchTable({ action: 'add', payload: { size, id } })
      return () => {
        dispatchTable({ action: 'remove', payload: { size, id } })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <th
        scope="col"
        ref={ref}
        className={cn(
          'table-cell sticky top-0 z-10',
          'bg-primary',
          'h-10 px-2 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
          className
        )}
        style={{ ...style, minWidth: size }}
        {...props}
      />
    )
  }
)

TableHead.displayName = 'TableHead'
