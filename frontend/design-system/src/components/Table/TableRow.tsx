import { Row, type RowProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableRow = <T extends object>({ className, ...props }: RowProps<T>) => (
  <Row
    data-slot="table-row"
    className={cn('border-b transition-colors hover:bg-muted/50 data-[selected]:bg-muted', className)}
    {...props}
  />
)
