import { EmailInput, Form, FormField, PrimaryButton } from '@Common/components'
import { useSnackbar } from 'notistack'
// import { useMutation } from '@Api'
import { forgotPasswordSchema } from '../config/validators'
import { graphqlRequestClient, useResetPasswordMutation } from '@Api'

type FormData = {
  email: string
}

// const MUTATION_RESET_PASSWORD = `mutation ResetPasswordMutation($email: String!) {
//   ResetPassword(email: $email) {
//     sessionId
//   }
// }`

type Props = {
  onSuccess: (sessionId: string) => void
}

export const ResetPassword = ({ onSuccess }: Props) => {
  const { mutate: doResetPassword, error, data: result } = useResetPasswordMutation(graphqlRequestClient, {})

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async (data: Partial<FormData>) => {
    try {
      await doResetPassword({ input: data })

      if (error) {
        console.log('Error Reset Password:', error)
        enqueueSnackbar({
          message: 'An error during reset password',
          variant: 'error',
        })
      } else {
        enqueueSnackbar({
          message: 'An email was sent to reset your password',
          variant: 'success',
        })
        onSuccess(result?.resetPassword?.token || '')
      }
    } catch (err) {
      console.log('Error Reset Password:', err)
      enqueueSnackbar({
        message: 'An error during reset password',
        variant: 'error',
      })
    }
  }

  return (
    <Form<FormData> onSubmit={onSubmit} className="flex flex-col p-2 gap-2" validation={forgotPasswordSchema}>
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
}
