import { cn } from '@repo/design-system'
import { CreateAreaBody } from '@Sdk/area/area.zod'
import { type CreateAreaMutationBody } from '@Sdk/area/area'
import { createFormFactory } from '@repo/form-factory'
import { useAreaForm } from '../application/useAreaForm'
import { Button, TextInputField, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'

const areaFormFactory = createFormFactory({ schema: CreateAreaBody })

type AreaFormProps = {
  areaId?: string
  defaultValues?: CreateAreaMutationBody
  onFinish?: VoidFunction
  className?: string
}

export const AreaForm = ({ defaultValues, areaId, onFinish, className }: AreaFormProps) => {
  const toast = Toast.useToast()
  const { form, Field, Form } = areaFormFactory.useForm({ defaultValues, mode: 'all' })
  const { isPending, submit } = useAreaForm()

  const onSubmit = async (data: CreateAreaMutationBody) => {
    try {
      await submit(data, areaId)
      toast(areaId ? 'Area is well updated' : 'Area is well created')
      onFinish?.()
    } catch {
      toast('Error during Area update')
    }
  }

  return (
    <Form name="areaForm" onSubmit={onSubmit} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => (
          <TextInputField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Name" errorMessage={fieldState.error?.message} />
        )}
      </Field>
      <Field name="address">
        {({ field, fieldState }) => (
          <TextInputField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Address" errorMessage={fieldState.error?.message} />
        )}
      </Field>
      <Field name="city">
        {({ field, fieldState }) => (
          <TextInputField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="City" errorMessage={fieldState.error?.message} />
        )}
      </Field>
      <Field name="longitude">
        {({ field, fieldState }) => (
          <TextInputField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Longitude" type="number" errorMessage={fieldState.error?.message} />
        )}
      </Field>
      <Field name="latitude">
        {({ field, fieldState }) => (
          <TextInputField name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Latitude" type="number" errorMessage={fieldState.error?.message} />
        )}
      </Field>
      <div className="flex flex-row-reverse py-1">
        <Button
          type="submit"
          variant="outline"
          isDisabled={!form.formState.isValid || !form.formState.isDirty || isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {areaId ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}
