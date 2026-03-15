import { CreateTeamMutationBody } from '@Sdk/team/team'
import { className as cn } from '@Common/utils/className'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTeamBody, UpdateTeamBody } from '@Sdk/team/team.zod'
import { useTeamForm } from './useTeamForm'
import Toast from '@Common/Toast/Toast'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Form } from '@Common/Form/Form'
import { z } from 'zod'
import { Team, TeamWithoutId } from '@Sdk/model'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'

const initialValues: TeamWithoutId = {
  name: '',
  color: '#000000',
}

type TeamFormProps = {
  teamId?: string
  defaultValues?: CreateTeamMutationBody | Team
  onFinish?: VoidFunction
  className?: string
}

export const TeamForm = ({ defaultValues, teamId, onFinish, className }: TeamFormProps) => {
  const toast = Toast.useToast()

  // Use updateTeamBody for updates, createTeamBody for creation
  const schema = useMemo(() => (teamId ? UpdateTeamBody : CreateTeamBody), [teamId])
  type FormValue = z.infer<typeof schema>

  // Prepare default values based on context
  const formDefaultValues = useMemo((): FormValue => {
    if (teamId) {
      // For update, ensure id is present from teamId
      // updateTeamBody requires id, so we must provide it
      if (defaultValues) {
        // If defaultValues has an id, use it; otherwise use teamId
        const hasId = 'id' in defaultValues && defaultValues.id
        const updateValues = {
          ...defaultValues,
          id: hasId ? (defaultValues as Team).id : teamId,
        }
        return updateValues as unknown as FormValue
      }
      // If no defaultValues provided, create minimal object with id
      const updateValues = {
        ...initialValues,
        id: teamId,
      }
      return updateValues as unknown as FormValue
    }
    // For create, use initialValues without id or provided defaultValues
    // createTeamBody does not require id, so we remove it if present
    const values = defaultValues || initialValues

    // Remove id if present for creation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { id, ...rest } = values as any
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
