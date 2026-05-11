import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Input, PasswordInput, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { Form } from '@Common/Form/Form'
import { FormattedMessage, useIntl } from '@I18n/translation'
import { useTeamOptions } from '@Teams'

const RegisterSchema = z
  .object({
    teamId: z.string().optional(),
    firstName: z.string().min(1, 'Required.'),
    lastName: z.string().min(1, 'Required.'),
    email: z.email('Enter a valid email address.'),
    password: z.string().min(8, 'Minimum 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof RegisterSchema>

function passwordStrength(pw: string): number {
  if (!pw) {
    return 0
  }
  let score = 0
  if (pw.length >= 8) {
    score++
  }
  if (/[A-Z]/.test(pw)) {
    score++
  }
  if (/[0-9]/.test(pw)) {
    score++
  }
  if (/[^A-Za-z0-9]/.test(pw)) {
    score++
  }
  return score
}

const STRENGTH_COLORS = ['', 'oklch(0.577 0.245 27)', 'oklch(0.75 0.18 60)', 'oklch(0.65 0.18 145)', 'oklch(0.5 0.18 145)']
const STRENGTH_KEYS = [
  '',
  'register.strength.weak',
  'register.strength.fair',
  'register.strength.good',
  'register.strength.strong',
] as const

// --- Sub-components ---

type FormFieldProps = {
  htmlFor: string
  label: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

const FormField = ({ htmlFor, label, error, hint, className, children }: FormFieldProps) => (
  <div className={`flex flex-col gap-1.5${className ? ` ${className}` : ''}`}>
    <label htmlFor={htmlFor} className="text-sm leading-none font-medium">
      {label}
    </label>
    {children}
    {error && <p className="text-destructive text-xs">{error}</p>}
    {hint && <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>}
  </div>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mb-3 text-[0.72rem] font-semibold tracking-widest uppercase">{children}</p>
)

// --- Main component ---

type RegisterFormProps = {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const toast = Toast.useToast()
  const intl = useIntl()
  const teams = useTeamOptions()

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'all',
  })

  const passwordValue = watch('password') ?? ''
  const strength = passwordStrength(passwordValue)

  const onSubmit = async (_data: RegisterFormValues) => {
    // TODO: wire up to register API when endpoint is available
    await new Promise(r => setTimeout(r, 800))
    toast(intl.formatMessage({ id: 'register.success' }))
    onSuccess?.()
  }

  return (
    <Form name="Register" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0" data-testid="register-form">
      <SectionLabel>
        <FormattedMessage id="register.section.team" />
      </SectionLabel>

      <Controller
        name="teamId"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            htmlFor="register-team"
            label={intl.formatMessage({ id: 'register.field.team' })}
            error={fieldState.error?.message}
            hint={intl.formatMessage({ id: 'register.field.team.hint' })}
            className="mb-4"
          >
            <select
              {...field}
              id="register-team"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex h-9 w-full cursor-pointer rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!!fieldState.error}
            >
              <option value="" disabled>
                {intl.formatMessage({ id: 'register.field.team.placeholder' })}
              </option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </FormField>
        )}
      />

      <SectionLabel>
        <FormattedMessage id="register.section.personalInfo" />
      </SectionLabel>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              htmlFor="register-firstname"
              label={intl.formatMessage({ id: 'register.field.firstName' })}
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                id="register-firstname"
                type="text"
                placeholder={intl.formatMessage({ id: 'register.field.firstName.placeholder' })}
                autoComplete="given-name"
                aria-invalid={!!fieldState.error}
              />
            </FormField>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              htmlFor="register-lastname"
              label={intl.formatMessage({ id: 'register.field.lastName' })}
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                id="register-lastname"
                type="text"
                placeholder={intl.formatMessage({ id: 'register.field.lastName.placeholder' })}
                autoComplete="family-name"
                aria-invalid={!!fieldState.error}
              />
            </FormField>
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            htmlFor="register-email"
            label={intl.formatMessage({ id: 'register.field.email' })}
            error={fieldState.error?.message}
            className="mb-4"
          >
            <Input
              {...field}
              id="register-email"
              type="email"
              placeholder={intl.formatMessage({ id: 'register.field.email.placeholder' })}
              autoComplete="email"
              aria-invalid={!!fieldState.error}
            />
          </FormField>
        )}
      />

      <SectionLabel>
        <FormattedMessage id="register.section.security" />
      </SectionLabel>

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            htmlFor="register-password"
            label={intl.formatMessage({ id: 'register.field.password' })}
            error={fieldState.error?.message}
            className="mb-4"
          >
            <PasswordInput
              {...field}
              id="register-password"
              placeholder={intl.formatMessage({ id: 'register.field.password.placeholder' })}
              autoComplete="new-password"
              aria-invalid={!!fieldState.error}
            />
            {passwordValue && (
              <div className="mt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-0.5 flex-1 rounded-sm transition-colors duration-200"
                      style={{ background: strength >= i ? STRENGTH_COLORS[strength] : 'var(--border)' }}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mt-0.5 text-[0.72rem]">
                  <FormattedMessage id={STRENGTH_KEYS[strength]} />
                </p>
              </div>
            )}
          </FormField>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            htmlFor="register-confirm-password"
            label={intl.formatMessage({ id: 'register.field.confirmPassword' })}
            error={fieldState.error?.message}
            className="mb-5"
          >
            <PasswordInput
              {...field}
              id="register-confirm-password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!fieldState.error}
            />
          </FormField>
        )}
      />

      <Button type="submit" variant="default" isDisabled={!isValid || !isDirty || isSubmitting} className="h-10 w-full">
        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
        <FormattedMessage id="register.submit" />
      </Button>
    </Form>
  )
}