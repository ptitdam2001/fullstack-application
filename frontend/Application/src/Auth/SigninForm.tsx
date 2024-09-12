import { useForm } from 'react-hook-form'
import { useAuthContext } from './AuthProvider'
import { useNavigate } from 'react-router-dom'
import { CONNECTED_HOME } from './constant'
import { Card, PasswordInput, PrimaryButton, TextInput } from 'dsu-react-common'

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
    <Card>
      <form name="Signin" onSubmit={handleSubmit(onSubmit)}>
        <TextInput htmlType="email" label="Email" {...register('email')} />
        <PasswordInput label="Password" {...register('password')} />
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    </Card>
  )
}
