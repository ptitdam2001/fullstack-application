import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyTitle3Props = React.ComponentProps<'h3'> & VariantProps<typeof typographyColorVariants>

export const TypographyTitle3 = ({ className, color, ...props }: TypographyTitle3Props) => (
  <h3
    data-slot="typography"
    className={cn(typographyColorVariants({ color }), 'text-xl font-semibold tracking-tight', className)}
    {...props}
  />
)