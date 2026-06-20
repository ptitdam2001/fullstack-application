import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographySubtitleProps = React.ComponentProps<'p'> & VariantProps<typeof typographyColorVariants>

export const TypographySubtitle = ({ className, color, ...props }: TypographySubtitleProps) => (
  <p
    data-slot="typography"
    className={cn(typographyColorVariants({ color }), 'text-lg font-medium', className)}
    {...props}
  />
)