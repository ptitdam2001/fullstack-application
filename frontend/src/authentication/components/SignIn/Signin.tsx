import { loginSchema } from '@Authentication/config/validators'
import { EmailInput, Form, FormField, PasswordInput, PrimaryButton } from '@Common/components'
import { useLoginUserMutation, graphqlRequestClient, LoginUserMutation } from '@Api'
import { memo } from 'react'

type FormData = {
  login: string
  password: string
}

type Props = {
  onConnectionDone: VoidFunction
}

const Signin = ({ onConnectionDone }: Props) => {
  const /*{ mutate: doLogin, isPending }*/ mutate = useLoginUserMutation(graphqlRequestClient, {
      onSuccess(data: LoginUserMutation) {
        // Set token

        // callback
        onConnectionDone()
      },
      onError(error: any) {
        console.log('Error Login:', error)
      },
    })
  console.log(mutate)
  const onSubmit = (data: Partial<FormData>) => {
    mutate.mutate({ input: data })
  }

  return (
    <Form<FormData>
      name="signin"
      onSubmit={onSubmit}
      className="p-2 flex flex-col gap-2"
      validation={loginSchema}
      mode="all"
      defaultValues={{ login: '', password: '' }}
    >
      <>
        <FormField name="login">
          {({ field, fieldState: { error } }) => (
            <EmailInput
              {...field}
              error={error?.message}
              label="Login"
              required
              disabled={mutate.isPending}
              borderless
            />
          )}
        </FormField>

        <FormField name="password">
          {({ field, fieldState: { error } }) => (
            <PasswordInput {...field} error={error?.message} label="Password" disabled={mutate.isPending} />
          )}
        </FormField>

        <PrimaryButton type="submit" disabled={mutate.isPending}>
          Signin
        </PrimaryButton>
      </>
    </Form>
  )
}
export default memo(Signin)
