import { cn } from '../../utils/cn'

export const LayoutRoot = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div data-slot="layout" className={cn('flex h-full w-full flex-col', className)} {...props} />
)
