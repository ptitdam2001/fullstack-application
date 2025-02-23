import { useForm } from 'react-hook-form'
import { Auth } from './Auth'
import { useNavigate } from 'react-router-dom'
import { CONNECTED_HOME } from './constant'
import { Button, Paper, TextField } from '@mui/material'

type FormInput = {
  email: string
  password: string
}

export const SigninForm = () => {
  const { login } = Auth.useAuthValue()
  const navigate = useNavigate()
  const { register, handleSubmit, getValues } = useForm<FormInput>()

  const onSubmit = async () => {
    const { email, password } = getValues()
    try {
      await login(email, password)
      navigate(CONNECTED_HOME)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Paper elevation={2} className="p-2 m-1">
      <form name="Signin" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
      </form>
    </Paper>
  )
}
