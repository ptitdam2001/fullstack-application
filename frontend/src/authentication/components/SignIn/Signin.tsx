import { loginSchema } from '@Authentication/config/validators'
import { Form, FormField, PasswordInput, PrimaryButton, TextInput } from '@Common/components'
import { useLoginUserMutation, graphqlRequestClient, LoginUserMutation } from '@Api'
import { memo } from 'react'

type FormData = {
  login: string
  password: string
}

type Props = {
  onConnectionDone: () => void
}

const Signin = ({ onConnectionDone }: Props) => {
  const { mutate: doLogin } = useLoginUserMutation(graphqlRequestClient, {
    onSuccess(data: LoginUserMutation) {
      // Set token

      // callback
      onConnectionDone()
    },
    onError(error: any) {
      console.log('Error Login:', error)
    }
  })

  const onSubmit = (data: Partial<FormData>) => {
    doLogin({ input: data })
  }

  return (
    <Form<FormData> name="signin" onSubmit={onSubmit} className="py-2 flex flex-col gap-2" validation={loginSchema} mode="all">
      <>
        <FormField name="login">
          {({ field, fieldState: { error } }) => <TextInput {...field} error={error?.message} label="Login" required />}
        </FormField>

        <FormField name="password">
          {({ field, fieldState: { error } }) => <PasswordInput {...field} error={error?.message} label="Password" />}
        </FormField>

        <PrimaryButton type="submit">Signin</PrimaryButton>
      </>
    </Form>
  )
}
export default memo(Signin)
