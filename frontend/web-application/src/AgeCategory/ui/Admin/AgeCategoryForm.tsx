import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Select, SelectItem, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { createFormFactory } from '@repo/form-factory'
import { CreateAgeCategoryBody } from '@Sdk/age-category/age-category.zod'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import type { AgeCategoryInput } from '../../domain/AgeCategory'
import { useAgeCategoryMutations } from '../../application/useAgeCategoryMutations'

const ageCategoryFormFactory = createFormFactory({ schema: CreateAgeCategoryBody })

const GENRES = ['MALE', 'FEMALE', 'MIXED'] as const

type AgeCategoryFormProps = {
  ageCategoryId?: string
  defaultValues?: AgeCategoryInput
  onFinish?: VoidFunction
}

export const AgeCategoryForm = ({ defaultValues, ageCategoryId, onFinish }: AgeCategoryFormProps) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { form, Field, Form } = ageCategoryFormFactory.useForm({ defaultValues, mode: 'all' })
  const { isPending, submit } = useAgeCategoryMutations()

  const onSubmit = async (data: AgeCategoryInput) => {
    try {
      await submit(data, ageCategoryId)
      toast(
        ageCategoryId
          ? intl.formatMessage({ id: 'adminAgeCategories.toast.updated' })
          : intl.formatMessage({ id: 'adminAgeCategories.toast.created' })
      )
      onFinish?.()
    } catch {
      toast(intl.formatMessage({ id: 'adminAgeCategories.toast.error' }))
    }
  }

  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return (
    <Form name="ageCategoryForm" onSubmit={onSubmit} className="flex h-full flex-col gap-4">
      <Field name="label">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'adminAgeCategories.form.label' })}
          />
        )}
      </Field>
      <Field name="genre">
        {({ field }) => (
          <Select
            label={intl.formatMessage({ id: 'adminAgeCategories.form.genre' })}
            value={(field.value as string) ?? null}
            onChange={key => field.onChange(key)}
          >
            {GENRES.map(genre => (
              <SelectItem key={genre} id={genre} textValue={genre}>
                <FormattedMessage id={`adminAgeCategories.genre.${genre}`} />
              </SelectItem>
            ))}
          </Select>
        )}
      </Field>
      <div className="flex flex-row-reverse pt-2">
        <Button
          type="submit"
          variant="outline"
          isDisabled={!isValid || !isDirty || isPending}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <FormattedMessage
            id={ageCategoryId ? 'adminAgeCategories.action.update' : 'adminAgeCategories.action.create'}
          />
        </Button>
      </div>
    </Form>
  )
}
