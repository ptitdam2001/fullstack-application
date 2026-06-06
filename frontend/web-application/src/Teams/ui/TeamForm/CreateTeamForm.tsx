import { cn } from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { CreateTeamBody } from '../../domain/Team'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import type { CreateTeamMutationBody, TeamWithoutId } from '../../domain/Team'
import { useTeamForm } from '../../application/useTeamForm'

const initialValues: TeamWithoutId = {
  name: '',
  color: '#000000',
}

const createTeamFormFactory = createFormFactory({ schema: CreateTeamBody })

type Props = {
  defaultValues?: CreateTeamMutationBody
  onFinish?: VoidFunction
  className?: string
}

export const CreateTeamForm = ({ defaultValues, onFinish, className }: Props) => {
  const toast = Toast.useToast()
  const { isPending, submit } = useTeamForm()
  const { form, Field, Form } = createTeamFormFactory.useForm({
    defaultValues: {
      name: defaultValues?.name ?? initialValues.name,
      color: defaultValues?.color ?? initialValues.color,
    },
    mode: 'all',
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      await submit(data as CreateTeamMutationBody)
      toast('Team is well created')
      onFinish?.()
    } catch {
      toast('Error during Team creation')
    }
  })

  return (
    <Form name="teamForm" onSubmit={onSubmit} className={cn('h-full', className)}>
      <Field name="name">
        {({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Name" testId="team-form.name" />
        )}
      </Field>
      <Field name="color">
        {({ field, fieldState }) => (
          <ColorInput {...field} label="Jersey color" error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />
        )}
      </Field>
      <div className="flex flex-row-reverse py-1">
        <Button type="submit" variant="outline" color="primary" disabled={!form.formState.isValid || !form.formState.isDirty || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Create
        </Button>
      </div>
    </Form>
  )
}
