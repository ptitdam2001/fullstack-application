import { type SubmitHandler } from 'react-hook-form'
import { cn } from '@repo/design-system'
import { CreateAreaBody } from '@Sdk/area/area.zod'
import { type CreateAreaMutationBody } from '@Sdk/area/area'
import { createFormFactory } from '@repo/form-factory'
import { useAreaForm } from '../application/useAreaForm'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Form } from '@Common/Form/Form'
import { Button, Toast } from '@repo/design-system'
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
  const { form, Field } = areaFormFactory.useForm({ defaultValues, mode: 'all' })
  const { isPending, submit } = useAreaForm()

  const onSubmit: SubmitHandler<CreateAreaMutationBody> = async data => {
    try {
      await submit(data, areaId)
      toast(areaId ? 'Area is well updated' : 'Area is well created')
      onFinish?.()
    } catch {
      toast('Error during Area update')
    }
  }

  return (
    <Form name="areaForm" onSubmit={form.handleSubmit(onSubmit)} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="Name" />}
      </Field>
      <Field name="address">
        {({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="Address" />}
      </Field>
      <Field name="city">
        {({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="City" />}
      </Field>
      <Field name="longitude">
        {({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Longitude" type="number" />
        )}
      </Field>
      <Field name="latitude">
        {({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Latitude" type="number" />
        )}
      </Field>
      <div className="flex flex-row-reverse py-1">
        <Button
          type="submit"
          variant="outline"
          color="primary"
          disabled={!form.formState.isValid || !form.formState.isDirty || isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {areaId ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}
