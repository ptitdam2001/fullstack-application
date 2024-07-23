import { EmailInput, Form, FormField, PrimaryButton } from '@Common/components'
import { useSnackbar } from 'notistack'
import { forgotPasswordSchema } from '@Authentication/config/validators'
import { ResetPasswordMutation, graphqlRequestClient, useResetPasswordMutation } from '@Api'
import { memo, useCallback } from 'react'

type FormData = {
  email: string
}

type Props = {
  onSuccess: (result: ResetPasswordMutation) => void
}

export const ResetPassword = memo(({ onSuccess }: Props) => {
  const { mutateAsync: doResetPassword } = useResetPasswordMutation(graphqlRequestClient, {})

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = useCallback(async (data: Partial<FormData>) => {
    try {
      const result = await doResetPassword({ input: data })
      enqueueSnackbar({
        message: 'An email was sent to reset your password',
        variant: 'success',
      })
      onSuccess(result)
    } catch (err) {
      console.log('Error Reset Password:', err)
      enqueueSnackbar({
        message: 'An error during reset password',
        variant: 'error',
      })
    }
  }, [])

  return (
    <Form<FormData>
      onSubmit={onSubmit}
      className="flex flex-col p-2 gap-2"
      validation={forgotPasswordSchema}
      defaultValues={{ email: '' }}
    >
      <>
        <FormField name="email">
          {({ field, fieldState: { error } }) => (
            <EmailInput {...field} placeholder="Tape your email" required error={error?.message} />
          )}
        </FormField>
        <PrimaryButton type="submit">Reinit.</PrimaryButton>
      </>
    </Form>
  )
})
