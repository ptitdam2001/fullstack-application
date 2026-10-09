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
  'data-testid'?: string
}

export const TextInputField = (allProps: TextInputFieldProps) => {
  const {
    label,
    errorMessage,
    isInvalid,
    isRequired,
    isDisabled,
    disabled,
    className,
    value,
    placeholder,
    'data-testid': dataTestId,
    ...props
  } = allProps
  // Controlled as soon as the caller passes the `value` prop, even undefined or null (a react-hook-form
  // field without a default value). Without the prop the field is uncontrolled and honours defaultValue.
  const coercedValue = value == null ? '' : String(value)
  const controlledValue = 'value' in allProps ? coercedValue : undefined
  const hasError = isInvalid || !!errorMessage

  return (
    <AriaTextField
      data-slot="text-input-field"
      isInvalid={hasError}
      isRequired={isRequired}
      isDisabled={isDisabled ?? disabled}
      value={controlledValue}
      className={cn('relative grid w-full items-center gap-1.5 pb-6', className)}
      {...props}
    >
      {label !== null && label !== undefined && (
        <Label>
          {label}
          {isRequired && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      <Input placeholder={placeholder} data-testid={dataTestId} />
      <FieldError className="absolute bottom-1">{errorMessage}</FieldError>
    </AriaTextField>
  )
}

TextInputField.displayName = 'TextInputField'
