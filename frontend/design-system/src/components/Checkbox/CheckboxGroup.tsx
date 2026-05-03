import * as React from 'react'
import { CheckboxGroup as AriaCheckboxGroup, Label } from 'react-aria-components'
import type { CheckboxGroupProps as AriaCheckboxGroupProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type CheckboxGroupProps = Omit<AriaCheckboxGroupProps, 'children'> & {
  label?: string
  children?: React.ReactNode
}

export const CheckboxGroup = ({ className, label, children, ...props }: CheckboxGroupProps) => (
  <AriaCheckboxGroup data-slot="checkbox-group" className={cn('flex flex-col gap-2', className)} {...props}>
    {label && <Label className="text-sm font-medium">{label}</Label>}
    {children}
  </AriaCheckboxGroup>
)
