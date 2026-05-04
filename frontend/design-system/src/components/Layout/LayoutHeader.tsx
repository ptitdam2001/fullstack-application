import { cn } from '../../utils/cn'

export const LayoutHeader = ({ className, ...props }: React.ComponentProps<'header'>) => (
  <header data-slot="layout-header" className={cn('shrink-0', className)} {...props} />
)
