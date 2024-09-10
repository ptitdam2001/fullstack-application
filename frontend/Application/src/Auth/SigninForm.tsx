import { useForm } from 'react-hook-form'
import { useAuthContext } from './AuthProvider'
import { useNavigate } from 'react-router-dom'
import { CONNECTED_HOME } from './constant'

type FormInput = {
  email: string
  password: string
}

export const SigninForm = () => {
  const { login } = useAuthContext()
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
    <form name="Signin" onSubmit={handleSubmit(onSubmit)}>
      <input type="email" {...register('email')} />
      <input type="password" {...register('password')} />
      <button type="submit">Login</button>
    </form>
  )
}
