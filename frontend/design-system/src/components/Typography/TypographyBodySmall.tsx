import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyBodySmallProps = React.ComponentProps<'p'> & VariantProps<typeof typographyColorVariants>

export const TypographyBodySmall = ({ className, color, ...props }: TypographyBodySmallProps) => (
  <p data-slot="typography" className={cn(typographyColorVariants({ color }), 'text-sm', className)} {...props} />
)