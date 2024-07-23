import { loginSchema } from '@Authentication/config/validators'
import { EmailInput, Form, FormField, PasswordInput, PrimaryButton } from '@Common/components'
import { WithDataTestIdProps } from '@Common/types'
import { useLoginUserMutation, graphqlRequestClient } from '@Api'
import { memo } from 'react'

type FormData = {
  login: string
  password: string
}

type Props = {
  onConnectionDone: VoidFunction
} & WithDataTestIdProps

export const Signin = memo(({ onConnectionDone, 'data-testid': testId }: Props) => {
  const mutate = useLoginUserMutation(graphqlRequestClient, {
    onSuccess(/* data: LoginUserMutation */) {
      // Set token

      // callback
      onConnectionDone()
    },
    onError(error) {
      console.log('Error Login:', error)
    },
  })

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

        <PrimaryButton type="submit" disabled={mutate.isPending} data-testid={testId && `${testId}--signin--btn`}>
          Signin
        </PrimaryButton>
      </>
    </Form>
  )
})
