import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { BadgeVariants } from './BadgeVariant'

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof BadgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span data-slot="badge" className={cn(BadgeVariants({ variant }), className)} {...props} />
)
