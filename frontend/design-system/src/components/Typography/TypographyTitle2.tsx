import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { typographyColorVariants } from './TypographyVariants'

type TypographyTitle2Props = React.ComponentProps<'h2'> & VariantProps<typeof typographyColorVariants>

export const TypographyTitle2 = ({ className, color, ...props }: TypographyTitle2Props) => (
  <h2
    data-slot="typography"
    className={cn(typographyColorVariants({ color }), 'text-2xl font-semibold tracking-tight', className)}
    {...props}
  />
)