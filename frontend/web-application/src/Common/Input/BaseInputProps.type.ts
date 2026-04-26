import { type FieldPath, type FieldPathValue, type FieldValues, type Noop, type RefCallBack } from 'react-hook-form'

export type BaseInputProps = {
  onChange: (...event: unknown[]) => void
  onBlur: Noop
  value: FieldPathValue<FieldValues, FieldPath<FieldValues>>
  disabled?: boolean
  name: FieldPath<FieldValues>
  ref: RefCallBack
}
