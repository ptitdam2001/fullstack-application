import { TextField, TextFieldProps } from '@mui/material'
import { ReactNode } from 'react'
import { ControllerFieldState } from 'react-hook-form'
import { BaseInputProps } from '../BaseInputProps.type'

type Props = Pick<TextFieldProps, 'type'> &
  BaseInputProps & {
    label?: ReactNode
    fieldState: ControllerFieldState
  }

export const ControlledTextInput = ({ label, fieldState, value, ...props }: Props) => (
  <TextField
    error={Boolean(fieldState.error)}
    id={props.name}
    label={label}
    variant="standard"
    fullWidth
    defaultValue={value}
    {...props}
    sx={{ mb: '0.5rem' }}
    helperText={fieldState.error?.message}
  />
)
