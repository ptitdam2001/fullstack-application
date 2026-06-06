import { useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { createFormFactory } from '@repo/form-factory'
import { ForgotPasswordBody } from '@Sdk/authentication/authentication.zod'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { useForgotPasswordAction } from '../../application/useForgotPasswordAction'
import { useResendActivation } from '../../infrastructure/useAuthApi'

const forgotPasswordFormFactory = createFormFactory({ schema: ForgotPasswordBody })

export const ForgottenPasswordForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending, isSuccess } = useForgotPasswordAction()
  const { mutateAsync: resend, isPending: isResending } = useResendActivation()
  const [sentEmail, setSentEmail] = useState<string>('')
  const { form, Field, Form } = forgotPasswordFormFactory.useForm({ mode: 'onBlur' })

  const onSubmit = form.handleSubmit(async (data) => {
    await process(data.email!)
    setSentEmail(data.email!)
  })

  const onResend = async () => {
    try {
      await resend({ data: { email: sentEmail } })
      toast(intl.formatMessage({ id: 'activate.resend.success' }))
    } catch {
      toast(intl.formatMessage({ id: 'auth.error.generic' }))
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium">
          <FormattedMessage id="activate.resend.success" />
        </p>
        <Button variant="outline" isDisabled={isResending} onPress={onResend} className="w-full max-w-sm">
          {isResending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="activate.error.resend" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="auth.forgottenPassword" />
      </h2>
      <Form onSubmit={onSubmit} className="flex flex-col">
        <Field name="email">
          {({ field, fieldState }) => (
            <ControlledTextInput
              {...field}
              fieldState={fieldState}
              label={intl.formatMessage({ id: 'auth.email' })}
              type="email"
              placeholder="vous@exemple.com"
              required
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