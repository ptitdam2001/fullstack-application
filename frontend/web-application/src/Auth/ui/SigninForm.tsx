import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { Form } from '@Common/Form/Form'
import { type z } from 'zod'
import { type LoginBody } from '@Sdk/authentication/authentication.zod'
import { Button, Input, Toast } from '@repo/design-system'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import { AuthProvider } from '../application/AuthProvider'
import { useLoginAction } from '../application/useLoginAction'

type FormValue = z.infer<typeof LoginBody>

type SigninFormProps = {
  className?: string
  onSuccess?: () => void
  forgotPasswordPath?: string
}

export const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, forgotPasswordPath }) => {
  const toast = Toast.useToast()
  const { process: login, isError, isSuccess, isPending } = useLoginAction()
  const { control, handleSubmit, getValues } = useForm<FormValue>()
  const { user } = AuthProvider.useAuthValue()
  const [showPassword, setShowPassword] = useState(false)

  React.useEffect(() => {
    if (isSuccess) {
      toast(`Welcome ${user?.firstname} ${user?.lastname}`)
      onSuccess?.()
    } else if (isError) {
      toast('Login failed')
    }
  }, [isError, isSuccess, onSuccess, toast, user?.firstname, user?.lastname])

  const onSubmit = () => {
    const { email, password } = getValues()
    login(email, password)
  }

  return (
    <Form name="Signin" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" data-testid="signin-form">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signin-email" className="text-sm leading-none font-medium">
              Email address
            </label>
            <Input
              {...field}
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!fieldState.error}
            />
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="signin-password" className="text-sm leading-none font-medium">
                Password
              </label>
              {forgotPasswordPath && (
                <Link
                  to={forgotPasswordPath}
                  className="text-xs font-medium underline underline-offset-4 transition-opacity hover:opacity-75"
                  style={{ color: 'var(--auth-accent)' }}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                {...field}
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!fieldState.error}
                className="pr-10"
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldState.error && <p className="text-destructive text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Button type="submit" variant="default" disabled={isPending} className="mt-1 h-10 w-full">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Signing in…
          </>
        ) : (
          <FormattedMessage id="auth.login" />
        )}
      </Button>
    </Form>
  )
}
