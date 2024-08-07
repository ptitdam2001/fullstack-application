import { Controller, useFormContext } from 'react-hook-form'
import { ReactElement } from 'react'

type FormFieldProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (controller: any) => ReactElement
}

export const FormField = ({ name, children }: FormFieldProps) => {
  const { control } = useFormContext()

  return <Controller name={name} control={control} render={children} />
}
