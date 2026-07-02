import * as React from 'react'
import { ColorField as AriaColorField } from 'react-aria-components'
import type { ColorFieldProps as AriaColorFieldProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { Label } from '../Label/Label'
import { Input } from '../Input/Input'
import { FieldError } from '../TextField/FieldError'

type ColorFieldProps = AriaColorFieldProps & {
  label?: React.ReactNode
  errorMessage?: string
  placeholder?: string
}

export const ColorField = ({ label, errorMessage, isInvalid, className, placeholder, ...props }: ColorFieldProps) => {
  const hasError = isInvalid || !!errorMessage

  return (
    <AriaColorField data-slot="color-field" isInvalid={hasError} className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      <FieldError>{errorMessage}</FieldError>
    </AriaColorField>
  )
}
