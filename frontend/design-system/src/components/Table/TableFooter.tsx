import { TableFooter as AriaTableFooter, type TableFooterProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TableFooter = <T extends object>({ className, ...props }: TableFooterProps<T>) => (
  <AriaTableFooter
    data-slot="table-footer"
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
)
