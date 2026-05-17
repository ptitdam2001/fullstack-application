import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIntl, FormattedMessage } from 'react-intl'
import { useSearchParams } from 'react-router'
import { Button, PasswordInput, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { ResetPasswordBody } from '@Sdk/authentication/authentication.zod'
import { Form } from '@Common/Form/Form'
import { useResetPasswordAction } from '../../application/useResetPasswordAction'

const ResetFormSchema = ResetPasswordBody.extend({
  confirmPassword: z.string().min(1),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ResetFormValues = z.infer<typeof ResetFormSchema>

export const ResetPasswordForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { process, isPending } = useResetPasswordAction()
  const { control, handleSubmit } = useForm<ResetFormValues>({
    resolver: zodResolver(ResetFormSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await process(token, data.newPassword)
    } catch {
      toast(intl.formatMessage({ id: 'resetPassword.error.generic' }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="resetPassword.title" />
      </h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
              <label className="text-sm font-medium leading-none">
                <FormattedMessage id="resetPassword.field.newPassword" />
              </label>
              <PasswordInput {...field} placeholder={intl.formatMessage({ id: 'resetPassword.field.newPassword.placeholder' })} />
              {fieldState.error && <p className="absolute bottom-1 text-sm text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
              <label className="text-sm font-medium leading-none">
                <FormattedMessage id="resetPassword.field.confirmPassword" />
              </label>
              <PasswordInput {...field} placeholder="••••••••" />
              {fieldState.error && <p className="absolute bottom-1 text-sm text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Button type="submit" isDisabled={isPending} className="w-full max-w-sm">
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="resetPassword.submit" />
        </Button>
      </Form>
    </div>
  )
}
