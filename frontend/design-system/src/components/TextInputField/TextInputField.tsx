import * as React from 'react'
import { TextField as AriaTextField } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { Label } from '../Label/Label'
import { Input } from '../Input/Input'
import { FieldError } from '../TextField/FieldError'

type TextInputFieldProps = Omit<React.ComponentProps<typeof AriaTextField>, 'children' | 'value'> & {
  label?: React.ReactNode
  errorMessage?: string
  value?: string | number | null
  placeholder?: string
  disabled?: boolean
}

export const TextInputField = ({
  label,
  errorMessage,
  isInvalid,
  isRequired,
  isDisabled,
  disabled,
  className,
  value,
  placeholder,
  ...props
}: TextInputFieldProps) => {
  const hasError = isInvalid || !!errorMessage

  return (
    <AriaTextField
      data-slot="text-input-field"
      isInvalid={hasError}
      isRequired={isRequired}
      isDisabled={isDisabled ?? disabled}
      value={value == null ? '' : String(value)}
      className={cn('relative grid w-full items-center gap-1.5 pb-6', className)}
      {...props}
    >
      {label != null && (
        <Label>
          {label}
          {isRequired && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      <Input placeholder={placeholder} />
      <FieldError className="absolute bottom-1">{errorMessage}</FieldError>
    </AriaTextField>
  )
}

TextInputField.displayName = 'TextInputField'
