import { Controller, useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import { useLoginAction } from '@Auth/hooks/useLoginAction'
import React from 'react'
import Toast from '@Common/Toast/Toast'
import { AuthProvider } from '@Auth/AuthProvider'
import { className as cn } from '@Common/utils/className'
import { Form } from '@Common/Form/Form'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { z } from 'zod'
import { loginBody } from '@Sdk/authentication/authentication.zod'

type FormValue = z.infer<typeof loginBody>

type SigninFormProps = {
  className?: string
  onSuccess?: () => void
}

export const SigninForm: React.FC<SigninFormProps> = ({ className, onSuccess }) => {
  const toast = Toast.useToast()
  const { process: login, isError, isSuccess } = useLoginAction()
  const { control, handleSubmit, getValues } = useForm<FormValue>()
  const { user } = AuthProvider.useAuthValue()

  React.useEffect(() => {
    if (isSuccess) {
      toast({ message: `Welcome ${user?.firstname} ${user?.lastname}` })
      onSuccess?.()
    } else if (isError) {
      // Handle error
      toast({ message: 'Login failed' })
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
        <Button variant="contained" type="submit">
          Login
        </Button>
      </div>
    </Form>
  )
}
