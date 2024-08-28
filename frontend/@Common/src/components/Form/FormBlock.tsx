import { ReactNode } from 'react'
import { UseFormReturn, useFormContext } from 'react-hook-form'

type FormBlockProps = {
  children: (form: UseFormReturn) => ReactNode
}

export const FormBlock = ({ children }: FormBlockProps) => {
  const form = useFormContext()

  return children(form)
}
