import * as React from 'react'
import { Table as AriaTable, type TableProps as AriaTableProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TableProps = AriaTableProps & {
  /** Visible legend, rendered outside the react-aria collection and linked through aria-describedby */
  caption?: React.ReactNode
}

export const Table = ({ className, caption, 'aria-describedby': describedBy, ...props }: TableProps) => {
  const captionId = React.useId()
  const hasCaption = caption !== undefined && caption !== null

  return (
    <div className="relative w-full overflow-auto">
      <AriaTable
        data-slot="table"
        className={cn('w-full text-sm', className)}
        aria-describedby={hasCaption ? [describedBy, captionId].filter(Boolean).join(' ') : describedBy}
        {...props}
      />
      {hasCaption && (
        <p id={captionId} data-slot="table-caption" className="text-muted-foreground mt-4 text-center text-sm">
          {caption}
        </p>
      )}
    </div>
  )
}
