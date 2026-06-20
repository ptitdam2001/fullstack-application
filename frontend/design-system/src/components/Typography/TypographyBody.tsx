import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyBodyProps = React.ComponentProps<'p'> & VariantProps<typeof typographyColorVariants>

export const TypographyBody = ({ className, color, ...props }: TypographyBodyProps) => (
  <p data-slot="typography" className={cn(typographyColorVariants({ color }), 'text-base', className)} {...props} />
)