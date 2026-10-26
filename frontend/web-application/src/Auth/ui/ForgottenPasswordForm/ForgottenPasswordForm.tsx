import { useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Button, TextInputField, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { createFormFactory } from '@repo/form-factory'
import { ForgotPasswordBody } from '@Sdk/authentication/authentication.zod'
import { useForgotPasswordAction } from '../../application/useForgotPasswordAction'
import { useResendActivationAction } from '../../application/useResendActivationAction'
import { getHttpStatus } from '../../infrastructure/httpError'

const forgotPasswordFormFactory = createFormFactory({ schema: ForgotPasswordBody })

export const ForgottenPasswordForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending, isSuccess } = useForgotPasswordAction()
  const { process: resendActivation, isPending: isResending } = useResendActivationAction()
  const [sentEmail, setSentEmail] = useState<string>('')
  const { Field, Form } = forgotPasswordFormFactory.useForm({ mode: 'onBlur' })

  const toastSendError = (err: unknown) => {
    if (getHttpStatus(err) === 429) {
      toast(intl.formatMessage({ id: 'auth.error.tooManyRequests' }))
    } else {
      toast(intl.formatMessage({ id: 'auth.error.generic' }))
    }
  }

  const onResendResetLink = async () => {
    try {
      await process(sentEmail)
      toast(intl.formatMessage({ id: 'forgotPassword.success' }))
    } catch (err: unknown) {
      toastSendError(err)
    }
  }

  // This screen is also the way back for an account that was never activated
  const onResendActivation = async () => {
    try {
      await resendActivation(sentEmail)
      toast(intl.formatMessage({ id: 'activate.resend.success' }))
    } catch (err: unknown) {
      toastSendError(err)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium">
          <FormattedMessage id="forgotPassword.success" />
        </p>
        <Button variant="outline" isDisabled={isPending} onPress={onResendResetLink} className="w-full max-w-sm">
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="forgotPassword.resend" />
        </Button>
        <p className="text-sm text-slate-500">
          <FormattedMessage id="forgotPassword.activation.hint" />{' '}
          <Button variant="link" isDisabled={isResending} onPress={onResendActivation} className="h-auto p-0">
            {isResending && <Loader2 className="animate-spin" />}
            <FormattedMessage id="activate.error.resend" />
          </Button>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="auth.forgottenPassword" />
      </h2>
      <Form
        onSubmit={async data => {
          try {
            await process(data.email!)
            setSentEmail(data.email!)
          } catch (err: unknown) {
            toastSendError(err)
          }
        }}
        className="flex flex-col"
      >
        <Field name="email">
          {({ field, fieldState }) => (
            <TextInputField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              label={intl.formatMessage({ id: 'auth.email' })}
              type="email"
              placeholder={intl.formatMessage({ id: 'auth.email.placeholder' })}
              isRequired
              errorMessage={fieldState.error?.message}
            />
          )}
        </Field>
        <Button type="submit" isDisabled={isPending} className="w-full max-w-sm">
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="auth.resetPassword" />
        </Button>
      </Form>
    </div>
  )
}
