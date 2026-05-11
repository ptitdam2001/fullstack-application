import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Toast,
} from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { FormattedMessage, useIntl } from '@I18n/translation'
import { TeamSelectField } from '@Teams'

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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mb-3 text-[0.72rem] font-semibold tracking-widest uppercase">{children}</p>
)

type RegisterFormProps = {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const toast = Toast.useToast()
  const intl = useIntl()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'all',
  })
  const { handleSubmit, watch, formState: { isSubmitting, isValid, isDirty } } = form

  const passwordValue = watch('password') ?? ''
  const strength = passwordStrength(passwordValue)

  const onSubmit = async (_data: RegisterFormValues) => {
    // TODO: wire up to register API when endpoint is available
    await new Promise(r => setTimeout(r, 800))
    toast(intl.formatMessage({ id: 'register.success' }))
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0" data-testid="register-form">
        <SectionLabel>
          <FormattedMessage id="register.section.team" />
        </SectionLabel>

        <FormField
          name="teamId"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="mb-4 flex flex-col gap-1.5">
              <FormLabel htmlFor="register-team">
                {intl.formatMessage({ id: 'register.field.team' })}
              </FormLabel>
              <TeamSelectField
                {...field}
                id="register-team"
                placeholder={intl.formatMessage({ id: 'register.field.team.placeholder' })}
                aria-invalid={!!fieldState.error}
              />
              <FormDescription>{intl.formatMessage({ id: 'register.field.team.hint' })}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SectionLabel>
          <FormattedMessage id="register.section.personalInfo" />
        </SectionLabel>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel htmlFor="register-firstname">
                  {intl.formatMessage({ id: 'register.field.firstName' })}
                </FormLabel>
                <Input
                  {...field}
                  id="register-firstname"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'register.field.firstName.placeholder' })}
                  autoComplete="given-name"
                  aria-invalid={!!fieldState.error}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel htmlFor="register-lastname">
                  {intl.formatMessage({ id: 'register.field.lastName' })}
                </FormLabel>
                <Input
                  {...field}
                  id="register-lastname"
                  type="text"
                  placeholder={intl.formatMessage({ id: 'register.field.lastName.placeholder' })}
                  autoComplete="family-name"
                  aria-invalid={!!fieldState.error}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="mb-4 flex flex-col gap-1.5">
              <FormLabel htmlFor="register-email">
                {intl.formatMessage({ id: 'register.field.email' })}
              </FormLabel>
              <Input
                {...field}
                id="register-email"
                type="email"
                placeholder={intl.formatMessage({ id: 'register.field.email.placeholder' })}
                autoComplete="email"
                aria-invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <SectionLabel>
          <FormattedMessage id="register.section.security" />
        </SectionLabel>

        <FormField
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="mb-4 flex flex-col gap-1.5">
              <FormLabel htmlFor="register-password">
                {intl.formatMessage({ id: 'register.field.password' })}
              </FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="mb-5 flex flex-col gap-1.5">
              <FormLabel htmlFor="register-confirm-password">
                {intl.formatMessage({ id: 'register.field.confirmPassword' })}
              </FormLabel>
              <PasswordInput
                {...field}
                id="register-confirm-password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="default" isDisabled={!isValid || !isDirty || isSubmitting} className="h-10 w-full">
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          <FormattedMessage id="register.submit" />
        </Button>
      </form>
    </Form>
  )
}
