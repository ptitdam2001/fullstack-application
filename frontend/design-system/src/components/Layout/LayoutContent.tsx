import type { VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { LayoutContentVariants } from './LayoutContentVariants'

type LayoutContentProps = React.ComponentProps<'div'> &
  VariantProps<typeof LayoutContentVariants> & {
    scrollerClassName?: string
  }

export const LayoutContent = ({ className, align, scrollerClassName, children, ...props }: LayoutContentProps) => (
  <div data-slot="layout-content" className={cn('min-h-0 flex-1 flex flex-col', className)} {...props}>
    <div className={cn(LayoutContentVariants({ align }), scrollerClassName)}>{children}</div>
  </div>
)
