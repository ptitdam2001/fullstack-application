import { WithDesignProps } from '../../types'
import { ReactElement } from 'react'
import { useForm, DefaultValues, FieldValues, FormProvider, Mode } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

type FormProps<T> = {
  name?: string
  onSubmit: (data: Partial<T>) => void
  children: ReactElement
  defaultValues?: DefaultValues<T>
  mode?: Mode
  validation?: ZodType<T>
} & WithDesignProps

export const Form = <T extends FieldValues>({
  children,
  name,
  onSubmit,
  defaultValues,
  mode = 'all',
  className,
  validation,
}: FormProps<T>) => {
  const form = useForm<T>({
    defaultValues,
    mode,
    resolver: validation ? zodResolver(validation) : undefined,
  })

  return (
    <FormProvider<T> {...form}>
      <form name={name} onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}
