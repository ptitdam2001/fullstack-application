import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyCaptionProps = React.ComponentProps<'span'> & VariantProps<typeof typographyColorVariants>

export const TypographyCaption = ({ className, color, ...props }: TypographyCaptionProps) => (
  <span
    data-slot="typography"
    className={cn(typographyColorVariants({ color }), 'text-xs font-medium', className)}
    {...props}
  />
)