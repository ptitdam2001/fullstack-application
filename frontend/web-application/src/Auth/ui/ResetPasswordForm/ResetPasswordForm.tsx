import { useIntl, FormattedMessage } from 'react-intl'
import { useSearchParams } from 'react-router'
import { Button, PasswordInput, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { createFormFactory } from '@repo/form-factory'
import { ResetPasswordBody } from '@Sdk/authentication/authentication.zod'
import { useResetPasswordAction } from '../../application/useResetPasswordAction'
import { isPasswordCompliant } from '../../domain/password'
import { getHttpStatus } from '../../infrastructure/httpError'

// confirmPassword is a UI-only field: it is checked here and never sent to the API
const ResetFormSchema = ResetPasswordBody.extend({
  newPassword: ResetPasswordBody.shape.newPassword.refine(isPasswordCompliant),
  confirmPassword: z.string().min(1),
}).refine(d => d.newPassword === d.confirmPassword, { path: ['confirmPassword'] })

type ResetFormValues = z.infer<typeof ResetFormSchema>

const resetPasswordFormFactory = createFormFactory({ schema: ResetFormSchema })

export const ResetPasswordForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { process, isPending } = useResetPasswordAction()
  const { Field, Form } = resetPasswordFormFactory.useForm({ mode: 'onBlur', defaultValues: { token } })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="resetPassword.title" />
      </h2>
      <Form
        onSubmit={async (data: ResetFormValues) => {
          try {
            await process(token, data.newPassword)
          } catch (err: unknown) {
            switch (getHttpStatus(err)) {
              case 400:
                toast(intl.formatMessage({ id: 'resetPassword.error.invalid' }))
                break
              case 429:
                toast(intl.formatMessage({ id: 'resetPassword.error.tooManyRequests' }))
                break
              default:
                toast(intl.formatMessage({ id: 'resetPassword.error.generic' }))
            }
          }
        }}
        className="flex flex-col"
      >
        <Field name="newPassword">
          {({ field, fieldState }) => (
            <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
              <label className="text-sm leading-none font-medium">
                <FormattedMessage id="resetPassword.field.newPassword" />
              </label>
              <PasswordInput
                {...field}
                placeholder={intl.formatMessage({ id: 'resetPassword.field.newPassword.placeholder' })}
              />
              {fieldState.error && (
                <p className="absolute bottom-1 text-sm text-red-500">
                  <FormattedMessage id="resetPassword.error.passwordRules" />
                </p>
              )}
            </div>
          )}
        </Field>
        <Field name="confirmPassword">
          {({ field, fieldState }) => (
            <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
              <label className="text-sm leading-none font-medium">
                <FormattedMessage id="resetPassword.field.confirmPassword" />
              </label>
              <PasswordInput {...field} placeholder="••••••••" />
              {fieldState.error && (
                <p className="absolute bottom-1 text-sm text-red-500">
                  <FormattedMessage id="resetPassword.error.passwordMismatch" />
                </p>
              )}
            </div>
          )}
        </Field>
        <Button type="submit" isDisabled={isPending} className="w-full max-w-sm">
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="resetPassword.submit" />
        </Button>
      </Form>
    </div>
  )
}
