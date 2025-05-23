import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { className as cn } from '@Common/utils/className'
import { createAreaBody } from '@Sdk/area/area.zod'
import { CreateAreaMutationBody } from '@Sdk/area/area'
import { useAreaForm } from './useAreaForm'
import Toast from '@Common/Toast/Toast'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Form } from '@Common/Form/Form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type AreaFormProps = {
  areaId?: string
  defaultValues?: CreateAreaMutationBody
  onFinish?: VoidFunction
  className?: string
}

export const AreaForm = ({ defaultValues, areaId, onFinish, className }: AreaFormProps) => {
  const toast = Toast.useToast()
  const { control, handleSubmit, formState } = useForm<CreateAreaMutationBody>({
    defaultValues,
    resolver: zodResolver(createAreaBody),
    mode: 'all',
  })
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
    <Form name="areaForm" onSubmit={handleSubmit(onSubmit)} className={cn('h-full', className)}>
      <Controller
        name="name"
        render={({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="Name" />}
        control={control}
      />

      <Controller
        name="address"
        render={({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="Address" />}
        control={control}
      />

      <Controller
        name="city"
        render={({ field, fieldState }) => <ControlledTextInput {...field} fieldState={fieldState} label="City" />}
        control={control}
      />

      <Controller
        name="longitude"
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Longitude" type="number" />
        )}
        control={control}
      />
      <Controller
        name="latitude"
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Latitude" type="number" />
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
          {areaId ? 'Update' : 'Create'}
        </Button>
      </div>
    </Form>
  )
}
