import { z } from 'zod'
import { FormattedMessage, useIntl } from 'react-intl'
import { cn } from '@repo/design-system'
import { CreateAreaBody } from '@Sdk/area/area.zod'
import { type CreateAreaMutationBody } from '@Sdk/area/area'
import { createFormFactory } from '@repo/form-factory'
import { useAreaForm } from '../application/useAreaForm'
import { Button, TextInputField, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'

// z.coerce.number() converts string values from <input type="number"> to number
// before Zod validates — required because TextInputField always emits strings
const areaFormSchema = CreateAreaBody.extend({
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),
})

const areaFormFactory = createFormFactory({ schema: areaFormSchema })

type AreaFormProps = {
  areaId?: string
  defaultValues?: CreateAreaMutationBody
  onFinish?: VoidFunction
  className?: string
}

export const AreaForm = ({ defaultValues, areaId, onFinish, className }: AreaFormProps) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { form, Field, Form } = areaFormFactory.useForm({ defaultValues, mode: 'all' })
  const { isPending, submit } = useAreaForm()

  const onSubmit = async (data: CreateAreaMutationBody) => {
    try {
      await submit(data, areaId)
      toast(
        areaId
          ? intl.formatMessage({ id: 'adminAreas.toast.updated' })
          : intl.formatMessage({ id: 'adminAreas.toast.created' })
      )
      onFinish?.()
    } catch {
      toast(intl.formatMessage({ id: 'adminAreas.toast.error' }))
    }
  }

  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return (
    <Form name="areaForm" onSubmit={onSubmit} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminAreas.form.name' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <Field name="address">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminAreas.form.address' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <Field name="city">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminAreas.form.city' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <Field name="longitude">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminAreas.form.longitude' })}
            type="number"
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <Field name="latitude">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminAreas.form.latitude' })}
            type="number"
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <div className="flex flex-row-reverse py-1">
        <Button type="submit" variant="outline" isDisabled={!isValid || !isDirty || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id={areaId ? 'adminAreas.action.update' : 'adminAreas.action.create'} />
        </Button>
      </div>
    </Form>
  )
}
