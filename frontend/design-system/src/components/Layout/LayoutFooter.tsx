import { cn } from '../../utils/cn'

export const LayoutFooter = ({ className, ...props }: React.ComponentProps<'footer'>) => (
  <footer data-slot="layout-footer" className={cn('shrink-0', className)} {...props} />
)
