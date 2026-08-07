import { FormattedMessage, useIntl } from 'react-intl'
import { Button, DatePicker, TextInputField, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { createFormFactory } from '@repo/form-factory'
import { CreateSeasonBody } from '@Sdk/season/season.zod'
import type { SeasonInput } from '../../domain/Season'
import { useSeasonMutations } from '../../application/useSeasonMutations'

const seasonFormFactory = createFormFactory({ schema: CreateSeasonBody })

type SeasonFormProps = {
  seasonId?: string
  defaultValues?: SeasonInput
  onFinish?: VoidFunction
}

export const SeasonForm = ({ defaultValues, seasonId, onFinish }: SeasonFormProps) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { form, Field, Form } = seasonFormFactory.useForm({ defaultValues, mode: 'all' })
  const { isPending, submit } = useSeasonMutations()

  const onSubmit = async (data: SeasonInput) => {
    try {
      await submit(data, seasonId)
      toast(
        seasonId
          ? intl.formatMessage({ id: 'adminSeasons.toast.updated' })
          : intl.formatMessage({ id: 'adminSeasons.toast.created' })
      )
      onFinish?.()
    } catch {
      toast(intl.formatMessage({ id: 'adminSeasons.toast.error' }))
    }
  }

  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return (
    <Form name="seasonForm" onSubmit={onSubmit} className="flex h-full flex-col gap-4">
      <Field name="label">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={intl.formatMessage({ id: 'adminSeasons.form.label' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>
      <Field name="startDate">
        {({ field }) => (
          <DatePicker
            label={intl.formatMessage({ id: 'adminSeasons.form.startDate' })}
            value={field.value ? new Date(field.value) : undefined}
            onChange={date => field.onChange(date ? date.toISOString() : null)}
          />
        )}
      </Field>
      <Field name="endDate">
        {({ field }) => (
          <DatePicker
            label={intl.formatMessage({ id: 'adminSeasons.form.endDate' })}
            value={field.value ? new Date(field.value) : undefined}
            onChange={date => field.onChange(date ? date.toISOString() : null)}
          />
        )}
      </Field>
      <div className="flex flex-row-reverse pt-2">
        <Button type="submit" variant="outline" isDisabled={!isValid || !isDirty || isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <FormattedMessage id={seasonId ? 'adminSeasons.action.update' : 'adminSeasons.action.create'} />
        </Button>
      </div>
    </Form>
  )
}
