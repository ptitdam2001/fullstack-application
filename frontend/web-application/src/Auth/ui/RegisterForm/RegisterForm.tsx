import { useIntl, FormattedMessage } from 'react-intl'
import { Button, PasswordInput, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { createFormFactory } from '@repo/form-factory'
import { RegisterBody } from '@Sdk/authentication/authentication.zod'
import type { RegisterInput } from '@Sdk/model'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { TeamSelectField } from '@Teams/ui/TeamSelect/TeamSelectField'
import { useRegisterAction } from '../../application/useRegisterAction'

const RegisterFormSchema = RegisterBody.extend({
  confirmPassword: z.string().min(1),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof RegisterFormSchema>

const registerFormFactory = createFormFactory({ schema: RegisterFormSchema })

const getPasswordStrength = (password: string): 0 | 1 | 2 | 3 => {
  let score = 0
  if (password.length >= 8) {
    score++
  }
  if (/[0-9]/.test(password)) {
    score++
  }
  if (/[A-Z]/.test(password)) {
    score++
  }
  return score as 0 | 1 | 2 | 3
}

const strengthKeys = [
  'register.strength.weak',
  'register.strength.fair',
  'register.strength.good',
  'register.strength.strong',
] as const
const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']

export const RegisterForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending, isSuccess } = useRegisterAction()
  const { form, Field, Form } = registerFormFactory.useForm({ mode: 'onBlur' })

  const password = form.watch('password') ?? ''
  const strength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const input: RegisterInput = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        teamId: data.teamId ?? undefined,
      }
      await process(input)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        toast(intl.formatMessage({ id: 'register.error.emailInUse' }))
      } else {
        toast(intl.formatMessage({ id: 'register.error.generic' }))
      }
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-green-600">
          <FormattedMessage id="register.success" />
        </p>
      </div>
    )
  }

  return (
    <Form onSubmit={onSubmit} className="flex flex-col">
      <Field name="firstName">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'register.field.firstName' })}
            placeholder={intl.formatMessage({ id: 'register.field.firstName.placeholder' })}
            required
          />
        )}
      </Field>
      <Field name="lastName">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'register.field.lastName' })}
            placeholder={intl.formatMessage({ id: 'register.field.lastName.placeholder' })}
          />
        )}
      </Field>
      <Field name="email">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'register.field.email' })}
            type="email"
            placeholder={intl.formatMessage({ id: 'register.field.email.placeholder' })}
            required
          />
        )}
      </Field>
      <Field name="teamId">
        {({ field }) => (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              <FormattedMessage id="register.field.team" />
            </label>
            <TeamSelectField value={field.value ?? undefined} onChange={(key) => field.onChange(key)} />
            <p className="mt-1 text-xs text-slate-500">
              <FormattedMessage id="register.field.team.hint" />
            </p>
          </div>
        )}
      </Field>
      <Field name="password">
        {({ field, fieldState }) => (
          <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
            <label className="text-sm leading-none font-medium">
              <FormattedMessage id="register.field.password" />
            </label>
            <PasswordInput {...field} placeholder={intl.formatMessage({ id: 'register.field.password.placeholder' })} />
            {password.length > 0 && (
              <div className="mt-1 flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength] : 'bg-slate-200'}`}
                  />
                ))}
                <span className="ml-2 text-xs text-slate-500">
                  <FormattedMessage id={strengthKeys[strength]} />
                </span>
              </div>
            )}
            {fieldState.error && <p className="absolute bottom-1 text-sm text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      </Field>
      <Field name="confirmPassword">
        {({ field, fieldState }) => (
          <div className="relative grid w-full max-w-sm items-center gap-1.5 pb-6">
            <label className="text-sm leading-none font-medium">
              <FormattedMessage id="register.field.confirmPassword" />
            </label>
            <PasswordInput {...field} placeholder="••••••••" />
            {fieldState.error && <p className="absolute bottom-1 text-sm text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      </Field>
      <Button type="submit" isDisabled={isPending} className="w-full max-w-sm">
        {isPending && <Loader2 className="animate-spin" />}
        <FormattedMessage id="register.submit" />
      </Button>
    </Form>
  )
}
