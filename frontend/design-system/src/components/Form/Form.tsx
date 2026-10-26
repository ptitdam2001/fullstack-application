import { Controller, FormProvider, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form'

import { FormFieldContext } from './FormContext'

const Form = FormProvider

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
)

export { Form, FormField }
