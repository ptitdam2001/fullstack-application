import * as React from 'react'
import { TextField as AriaTextField } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TextFieldProps = React.ComponentProps<typeof AriaTextField>

export const TextField = ({ className, ...props }: TextFieldProps) => (
  <AriaTextField data-slot="text-field" className={cn('flex flex-col gap-1.5', className)} {...props} />
)
