import { Button as AriaButton, composeRenderProps } from 'react-aria-components'
import type { ButtonProps as AriaButtonProps } from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { ButtonVariants } from './ButtonVariants'

type ButtonProps = AriaButtonProps & VariantProps<typeof ButtonVariants>

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <AriaButton
    data-slot="button"
    className={composeRenderProps(className, cls => cn(ButtonVariants({ variant, size }), cls))}
    {...props}
  />
)
