import Toast from '@Common/Toast/Toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForgotPassword } from '@Sdk/authentication/authentication'
import { forgotPasswordBody } from '@Sdk/authentication/authentication.zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { className as cn } from '@Common/utils/className'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Form } from '@Common/Form/Form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type FormValue = z.infer<typeof forgotPasswordBody>

type ForgottenPasswordFormProps = {
  onFinish?: () => void
  className?: string
}

export const ForgottenPasswordForm: React.FC<ForgottenPasswordFormProps> = ({ onFinish, className }) => {
  const { mutate, isPending } = useForgotPassword()
  const toast = Toast.useToast()

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(forgotPasswordBody),
    mode: 'all',
  })

  const onSubmit = (data: FormValue) => {
    mutate(
      { data },
      {
        onSuccess: () => {
          // Handle success, e.g., show a success message
          toast('Password reset email sent successfully')
          onFinish?.()
        },
        onError: () => {
          // Handle error, e.g., show an error message
          toast('Error sending password reset email')
        },
      }
    )
  }

  return (
    <Form
      name="ForgottenPassword"
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-4', className)}
      data-testid="forgotten-password-form"
      // enableDevTools
      // devToolsProps={{
      //   control,
      //   placement: 'bottom-right',
      // }}
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Email" type="email" />
        )}
      />

      <div className="flex flex-row-reverse py-1">
        <Button
          type="submit"
          variant="outline"
          color="primary"
          disabled={!formState.isValid || !formState.isDirty || isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Send
        </Button>
      </div>
    </Form>
  )
}
