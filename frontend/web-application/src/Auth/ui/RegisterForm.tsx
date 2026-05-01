import { zodResolver } from '@hookform/resolvers/zod'
import { useGetTeams } from '@Sdk/teams/teams'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Input, Toast } from '@repo/design-system'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Form } from '@Common/Form/Form'

const RegisterSchema = z
  .object({
    teamId: z.string().min(1, 'Please select a team.'),
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

const STRENGTH_COLORS = [
  '',
  'oklch(0.577 0.245 27)',
  'oklch(0.75 0.18 60)',
  'oklch(0.65 0.18 145)',
  'oklch(0.5 0.18 145)',
]
const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Bon', 'Fort']

type RegisterFormProps = {
  onSuccess?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const toast = Toast.useToast()
  const { data: teamsData } = useGetTeams()
  const teams = teamsData ?? []

  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
    toast('Registration submitted — awaiting team admin approval.')
    onSuccess?.()
  }

  return (
    <Form name="Register" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0" data-testid="register-form">
      {/* Team */}
      <p className="text-muted-foreground mb-3 text-[0.72rem] font-semibold tracking-widest uppercase">Your team</p>

      <Controller
        name="teamId"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="register-team" className="text-sm leading-none font-medium">
              Team
            </label>
            <select
              {...field}
              id="register-team"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex h-9 w-full cursor-pointer rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!!fieldState.error}
            >
              <option value="" disabled>
                Select a team…
              </option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
            <p className="text-muted-foreground text-xs leading-relaxed">
              Votre inscription sera soumise à la validation de l&apos;administrateur de l&apos;équipe avant d&apos;être
              activée.
            </p>
          </div>
        )}
      />

      {/* Personal info */}
      <p className="text-muted-foreground mb-3 text-[0.72rem] font-semibold tracking-widest uppercase">Personal info</p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-firstname" className="text-sm leading-none font-medium">
                First name
              </label>
              <Input
                {...field}
                id="register-firstname"
                type="text"
                placeholder="Guy"
                autoComplete="given-name"
                aria-invalid={!!fieldState.error}
              />
              {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-lastname" className="text-sm leading-none font-medium">
                Last name
              </label>
              <Input
                {...field}
                id="register-lastname"
                type="text"
                placeholder="Dupont"
                autoComplete="family-name"
                aria-invalid={!!fieldState.error}
              />
              {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-sm leading-none font-medium">
              Email address
            </label>
            <Input
              {...field}
              id="register-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!fieldState.error}
            />
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />

      {/* Security */}
      <p className="text-muted-foreground mb-3 text-[0.72rem] font-semibold tracking-widest uppercase">Security</p>

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-sm leading-none font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                {...field}
                id="register-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                aria-invalid={!!fieldState.error}
                className="pr-10"
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordValue && (
              <div className="mt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-0.5 flex-1 rounded-sm transition-colors duration-200"
                      style={{
                        background: strength >= i ? STRENGTH_COLORS[strength] : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mt-0.5 text-[0.72rem]">{STRENGTH_LABELS[strength]}</p>
              </div>
            )}
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <div className="mb-5 flex flex-col gap-1.5">
            <label htmlFor="register-confirm-password" className="text-sm leading-none font-medium">
              Confirm password
            </label>
            <div className="relative">
              <Input
                {...field}
                id="register-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!fieldState.error}
                className="pr-10"
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Button type="submit" variant="default" disabled={!isValid || !isDirty || isSubmitting} className="h-10 w-full">
        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
        Create account
      </Button>
    </Form>
  )
}
