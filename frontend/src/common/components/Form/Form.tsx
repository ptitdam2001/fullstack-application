import { WithDesignProps } from '@Common/types'
import { ReactElement } from 'react'
import { useForm, DefaultValues, FieldValues, FormProvider, Mode } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'

type FormProps<T> = {
  name?: string
  onSubmit: (data: Partial<T>) => void
  children: ReactElement
  defaultValues?: DefaultValues<T>
  mode?: Mode
  validation?: Joi.Schema<T>
} & WithDesignProps

export const Form = <T extends FieldValues>({ children, name, onSubmit, defaultValues, mode = 'all', className, validation }: FormProps<T>) => {
  const form = useForm<T>({
    defaultValues,
    mode,
    resolver: validation ? joiResolver(validation) : undefined,
  })

  return (
    <FormProvider<T> {...form}>
      <form name={name} onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}
