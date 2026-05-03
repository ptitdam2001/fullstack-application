import * as React from 'react'
import { FieldError as AriaFieldError } from 'react-aria-components'

import { cn } from '../../utils/cn'

type FieldErrorProps = React.ComponentProps<typeof AriaFieldError>

export const FieldError = ({ className, ...props }: FieldErrorProps) => (
  <AriaFieldError
    data-slot="field-error"
    className={cn('text-destructive text-sm', className)}
    {...props}
  />
)
