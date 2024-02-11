import { Controller, useFormContext } from 'react-hook-form'
import { ReactElement } from 'react'

type FormFieldProps = {
  name: string
  children: (controller: any) => ReactElement
}

export const FormField = ({ name, children }: FormFieldProps) => {
  const { control } = useFormContext()

  return <Controller name={name} control={control} render={children} />
}
