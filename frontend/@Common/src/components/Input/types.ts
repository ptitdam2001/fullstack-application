import { InputHTMLAttributes } from 'react'

export type InputValueType = InputHTMLAttributes<HTMLInputElement>['value']

export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  defaultValue?: InputValueType
  borderless?: boolean
}
