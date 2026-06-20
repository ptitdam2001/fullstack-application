import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyTitle1Props = React.ComponentProps<'h1'> & VariantProps<typeof typographyColorVariants>

export const TypographyTitle1 = ({ className, color, ...props }: TypographyTitle1Props) => (
  <h1
    data-slot="typography"
    className={cn(typographyColorVariants({ color }), 'text-3xl font-bold tracking-tight', className)}
    {...props}
  />
)