import { CreateTeamMutationBody } from '@Sdk/team/team'
import { className as cn } from '@Common/utils/className'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTeamBody } from '@Sdk/team/team.zod'
import { useTeamForm } from './useTeamForm'
import Toast from '@Common/Toast/Toast'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Button } from '@mui/material'
import { ColorInput } from '@Common/Input/ColorInput/ColorInput'
import { Form } from '@Common/Form/Form'

type TeamFormProps = {
  teamId?: string
  defaultValues?: CreateTeamMutationBody
  onFinish?: VoidFunction
  className?: string
}

export const TeamForm = ({ defaultValues, teamId, onFinish, className }: TeamFormProps) => {
  const toast = Toast.useToast()

  const { control, handleSubmit, formState } = useForm({
    defaultValues,
    resolver: zodResolver(createTeamBody),
    mode: 'all',
  })
  const { isPending, submit } = useTeamForm()

  const onSubmit: SubmitHandler<CreateTeamMutationBody> = async data => {
    try {
      await submit(data, teamId)
      toast({ message: 'Area is well updated' })
      onFinish?.()
    } catch {
      toast({ message: 'Error during Area update' })
    }
  }

  return (
    <Form name="teamForm" onSubmit={handleSubmit(onSubmit)} className={cn('h-full', className)}>
      <Controller
        name="name"
        render={({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="Name" />}
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
          variant="outlined"
          color="primary"
          disabled={!formState.isValid || !formState.isDirty || isPending}
          loading={isPending}
          loadingPosition="start"
        >
          {teamId ? 'Update' : 'Create'}
        </Button>
        {/* <DevTool control={control} placement="bottom-right" /> */}
      </div>
    </Form>
  )
}
