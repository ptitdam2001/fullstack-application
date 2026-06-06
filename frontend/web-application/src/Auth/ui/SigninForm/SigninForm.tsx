import { useIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import { Button, PasswordInput, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { createFormFactory } from '@repo/form-factory'
import { LoginBody } from '@Sdk/authentication/authentication.zod'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { useLoginAction } from '../../application/useLoginAction'

const signinFormFactory = createFormFactory({ schema: LoginBody })

type SigninFormProps = {
  forgotPasswordHref?: string
}

export const SigninForm = ({ forgotPasswordHref }: SigninFormProps) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending } = useLoginAction()
  const { form, Field, Form } = signinFormFactory.useForm({ mode: 'onBlur' })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="auth.login" />
      </h2>
      <Form
        onSubmit={async data => {
          try {
            await process(data.email!, data.password!)
          } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? ''
            if (status === 403 && message.toLowerCase().includes('activé')) {
              toast(intl.formatMessage({ id: 'auth.error.accountInactive' }))
            } else if (status === 403) {
              toast(intl.formatMessage({ id: 'auth.error.accountBlocked' }))
            } else {
              toast(intl.formatMessage({ id: 'auth.error.invalidCredentials' }))
            }
          }
        }}
        className="flex flex-col"
      >
        <Field name="email">
          {({ field, fieldState }) => (
            <ControlledTextInput
              {...field}
              fieldState={fieldState}
              label={intl.formatMessage({ id: 'auth.email' })}
              type="email"
              placeholder="vous@exemple.com"
            />
          )}
        </Field>
        <Field name="password">
          {({ field, fieldState }) => (
            <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
              <label className="text-sm leading-none font-medium">
                <FormattedMessage id="auth.password" />
              </label>
              <PasswordInput {...field} placeholder="••••••••" />
              {fieldState.error && <p className="absolute bottom-1 text-sm text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        </Field>
        {forgotPasswordHref && (
          <Link to={forgotPasswordHref} className="mb-4 text-sm text-blue-600 hover:underline">
            <FormattedMessage id="auth.forgottenPassword" />
          </Link>
        )}
        <Button type="submit" isDisabled={isPending} className="w-full max-w-sm">
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="auth.signin" />
        </Button>
      </Form>
    </div>
  )
}
