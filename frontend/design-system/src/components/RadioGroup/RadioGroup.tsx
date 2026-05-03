import * as React from 'react'
import { RadioGroup as AriaRadioGroup, Label } from 'react-aria-components'
import type { RadioGroupProps as AriaRadioGroupProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type RadioGroupProps = Omit<AriaRadioGroupProps, 'children'> & {
  label?: string
  children?: React.ReactNode
}

export const RadioGroup = ({ className, label, children, ...props }: RadioGroupProps) => (
  <AriaRadioGroup
    data-slot="radio-group"
    className={cn('flex flex-col gap-2', className)}
    {...props}
  >
    {label && <Label className="text-sm font-medium">{label}</Label>}
    {children}
  </AriaRadioGroup>
)
