import { cn } from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { UpdateTeamBody } from '../../domain/Team'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import type { CreateTeamMutationBody, Team, TeamWithoutId } from '../../domain/Team'
import { useTeamForm } from '../../application/useTeamForm'

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
  const toast = Toast.useToast()
  const { isPending, submit } = useTeamForm()
  const { form, Field, Form } = updateTeamFormFactory.useForm({
    defaultValues: {
      id: defaultValues?.id ?? teamId,
      name: defaultValues?.name ?? initialValues.name,
      color: defaultValues?.color ?? initialValues.color,
      areas: defaultValues?.areas ?? [],
    },
    mode: 'all',
  })

  const onSubmit = async (data: CreateTeamMutationBody) => {
    try {
      await submit(data, teamId)
      toast('Team is well updated')
      onFinish?.()
    } catch {
      toast('Error during Team update')
    }
  }
  return (
    <Form name="teamForm" onSubmit={onSubmit} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Name" testId="team-form.name" />
        )}
      </Field>
      <Field name="color">
        {({ field, fieldState }) => (
          <ColorInput
            {...field}
            label="Jersey color"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      </Field>
      <div className="flex flex-row-reverse py-1">
        <Button type="submit" variant="outline" isDisabled={!form.formState.isDirty || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Update
        </Button>
      </div>
    </Form>
  )
}
