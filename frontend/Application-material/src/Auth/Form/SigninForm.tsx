import { Controller, useForm } from 'react-hook-form'
import { useLoginAction } from '@Auth/hooks/useLoginAction'
import React from 'react'
import Toast from '@Common/Toast/Toast'
import { AuthProvider } from '@Auth/AuthProvider'
import { className as cn } from '@Common/utils/className'
import { Form } from '@Common/Form/Form'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { z } from 'zod'
import { loginBody } from '@Sdk/authentication/authentication.zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type FormValue = z.infer<typeof loginBody>

type SigninFormProps = {
  className?: string
  onSuccess?: () => void
}

export const SigninForm: React.FC<SigninFormProps> = ({ className, onSuccess }) => {
  const toast = Toast.useToast()
  const { process: login, isError, isSuccess, isPending } = useLoginAction()
  const { control, handleSubmit, getValues } = useForm<FormValue>()
  const { user } = AuthProvider.useAuthValue()

  React.useEffect(() => {
    if (isSuccess) {
      toast(`Welcome ${user?.firstname} ${user?.lastname}`)
      onSuccess?.()
    } else if (isError) {
      // Handle error
      toast('Login failed')
    }
  }, [isError, isSuccess, onSuccess, toast, user?.firstname, user?.lastname])

  const onSubmit = () => {
    const { email, password } = getValues()
    login(email, password)
  }

  return (
    <Form
      name="Signin"
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-2', className)}
      data-testid="signin-form"
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Email" type="email" />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <ControlledTextInput {...field} fieldState={fieldState} label="Password" type="password" />
        )}
      />

      <div>
        <Button type="submit" variant="outline" color="primary" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Login
        </Button>
      </div>
    </Form>
  )
}
