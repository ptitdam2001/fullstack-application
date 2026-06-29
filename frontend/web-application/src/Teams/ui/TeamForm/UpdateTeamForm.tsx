import { cn } from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { UpdateTeamBody } from '../../domain/Team'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import type { CreateTeamMutationBody, Team, TeamWithoutId } from '../../domain/Team'
import { useTeamForm } from '../../application/useTeamForm'
import { AgeCategorySelect } from '@AgeCategory/ui/AgeCategorySelect/AgeCategorySelect'
import { useIntl } from 'react-intl'

const initialValues: TeamWithoutId = {
  name: '',
  color: '#000000',
}

const updateTeamFormFactory = createFormFactory({ schema: UpdateTeamBody })

type Props = {
  teamId: string
  defaultValues?: Team
  onFinish?: VoidFunction
  className?: string
}

export const UpdateTeamForm = ({ teamId, defaultValues, onFinish, className }: Props) => {
  const { formatMessage } = useIntl()
  const toast = Toast.useToast()
  const { isPending, submit } = useTeamForm()
  const { form, Field, Form } = updateTeamFormFactory.useForm({
    defaultValues: {
      id: defaultValues?.id ?? teamId,
      name: defaultValues?.name ?? initialValues.name,
      color: defaultValues?.color ?? initialValues.color,
      areas: defaultValues?.areas ?? [],
      ageCategoryId: defaultValues?.ageCategoryId ?? null,
    },
    mode: 'all',
  })

  const onSubmit = async (data: CreateTeamMutationBody) => {
    try {
      await submit(data, teamId)
      toast(formatMessage({ id: 'adminTeams.toast.updated' }))
      onFinish?.()
    } catch {
      toast(formatMessage({ id: 'adminTeams.toast.updateError' }))
    }
  }
  return (
    <Form name="teamForm" onSubmit={onSubmit} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label={formatMessage({ id: 'adminTeams.form.name' })} testId="team-form.name" />
        )}
      </Field>

      <Field name="ageCategoryId">
        {({ field }) => <AgeCategorySelect value={field.value} onChange={field.onChange} />}
      </Field>

      <Field name="color">
        {({ field, fieldState }) => (
          <ColorInput
            {...field}
            label={formatMessage({ id: 'adminTeams.form.color' })}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      </Field>

      <div className="flex flex-row-reverse py-1">
        <Button type="submit" variant="outline" isDisabled={!form.formState.isDirty || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {formatMessage({ id: 'adminTeams.form.submit.update' })}
        </Button>
      </div>
    </Form>
  )
}
