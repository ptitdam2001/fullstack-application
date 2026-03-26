import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '../../utils/cn'
import { Label } from '../Label/Label'
import { useFormField } from './Form'

function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

export { FormLabel }
