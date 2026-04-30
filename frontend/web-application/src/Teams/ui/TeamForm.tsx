import { cn } from '@repo/design-system'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTeamBody, UpdateTeamBody } from '@Sdk/team/team.zod'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Form } from '@Common/Form/Form'
import { type z } from 'zod'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import type { CreateTeamMutationBody, Team, TeamWithoutId } from '../domain/Team'
import { useTeamForm } from '../application/useTeamForm'

const initialValues: TeamWithoutId = {
  name: '',
  color: '#000000',
}

type Props = {
  teamId?: string
  defaultValues?: CreateTeamMutationBody | Team
  onFinish?: VoidFunction
  className?: string
}

export const TeamForm = ({ defaultValues, teamId, onFinish, className }: Props) => {
  const toast = Toast.useToast()
  const schema = useMemo(() => (teamId ? UpdateTeamBody : CreateTeamBody), [teamId])
  type FormValue = z.infer<typeof schema>

  const formDefaultValues = useMemo((): FormValue => {
    if (teamId) {
      if (defaultValues) {
        const hasId = 'id' in defaultValues && defaultValues.id
        return { ...defaultValues, id: hasId ? (defaultValues as Team).id : teamId } as unknown as FormValue
      }
      return { ...initialValues, id: teamId } as unknown as FormValue
    }
    const values = defaultValues || initialValues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id: _id, ...rest } = values as any
    return rest as FormValue
  }, [defaultValues, teamId])

  const { control, handleSubmit, formState } = useForm<FormValue>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(schema),
    mode: 'all',
  })
  const { isPending, submit } = useTeamForm()

  const onSubmit: SubmitHandler<FormValue> = async data => {
    try {
      await submit(data as CreateTeamMutationBody, teamId)
      toast(teamId ? 'Team is well updated' : 'Team is well created')
      onFinish?.()
    } catch {
      toast(teamId ? 'Error during Team update' : 'Error during Team creation')
    }
  }

  return (
    <Form name="teamForm" onSubmit={handleSubmit(onSubmit)} className={cn('h-full', className)}>
      <Controller
        name="name"
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Name" testId="team-form.name" />
        )}
        control={control}
      />
      <Controller
        name="color"
        render={({ field, fieldState }) => (
          <ColorInput
            {...field}
            label="Jersey color"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
        control={control}
      />
      <div className="flex flex-row-reverse py-1">
        <Button
          type="submit"
          variant="outline"
          color="primary"
          disabled={!formState.isValid || !formState.isDirty || isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {teamId ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}
