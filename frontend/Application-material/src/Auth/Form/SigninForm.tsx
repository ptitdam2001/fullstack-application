import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { CONNECTED_HOME } from '../constant'
import { Button, TextField } from '@mui/material'
import { useLoginAction } from '@Auth/hooks/useLoginAction'
import React from 'react'
import Toast from '@Common/Toast/Toast'
import { AuthProvider } from '@Auth/AuthProvider'
import { className as cn } from '@Common/utils/className'
import { Form } from '@Common/Form/Form'

type FormInput = {
  email: string
  password: string
}

type SigninFormProps = {
  className?: string
}

export const SigninForm: React.FC<SigninFormProps> = ({ className }) => {
  const toast = Toast.useToast()
  const { process: login, isError, isSuccess } = useLoginAction()
  const navigate = useNavigate()
  const { register, handleSubmit, getValues } = useForm<FormInput>()
  const { user } = AuthProvider.useAuthValue()

  React.useEffect(() => {
    if (isSuccess) {
      toast({ message: `Welcome ${user?.firstname} ${user?.lastname}` })
      navigate(CONNECTED_HOME)
    } else if (isError) {
      // Handle error
      console.error('Login failed')
      toast({ message: 'Login failed' })
    }
  }, [isError, isSuccess, navigate, toast, user?.firstname, user?.lastname])

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
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="current-password"
        variant="standard"
        {...register('email')}
      />
      <TextField
        id="password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="standard"
        {...register('password')}
      />
      <div>
        <Button variant="contained" type="submit">
          Login
        </Button>
      </div>
    </Form>
  )
}
