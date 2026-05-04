import type { VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { LayoutContentVariants } from './LayoutContentVariants'

type LayoutContentProps = React.ComponentProps<'div'> & VariantProps<typeof LayoutContentVariants>

export const LayoutContent = ({ className, align, ...props }: LayoutContentProps) => (
  <div data-slot="layout-content" className={cn(LayoutContentVariants({ align }), className)} {...props} />
)
