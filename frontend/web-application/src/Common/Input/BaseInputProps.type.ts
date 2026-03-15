import { FieldPath, FieldPathValue, FieldValues, Noop, RefCallBack } from 'react-hook-form'

export type BaseInputProps = {
  onChange: (...event: unknown[]) => void
  onBlur: Noop
  value: FieldPathValue<FieldValues, FieldPath<FieldValues>>
  disabled?: boolean
  name: FieldPath<FieldValues>
  ref: RefCallBack
}
