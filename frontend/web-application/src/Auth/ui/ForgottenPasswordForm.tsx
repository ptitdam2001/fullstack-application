import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { type z } from 'zod'
import { Form } from '@Common/Form/Form'
import { Button, Input, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { ForgotPasswordBody } from '@Sdk/authentication/authentication.zod'
import { useForgotPassword } from '../infrastructure/useAuthApi'

type FormValue = z.infer<typeof ForgotPasswordBody>

type ForgottenPasswordFormProps = {
  onSent?: (email: string) => void
  className?: string
}

export const ForgottenPasswordForm: React.FC<ForgottenPasswordFormProps> = ({ onSent, className }) => {
  const { mutate, isPending } = useForgotPassword()
  const toast = Toast.useToast()

  const { control, handleSubmit, formState, getValues } = useForm({
    resolver: zodResolver(ForgotPasswordBody),
    mode: 'all',
  })

  const onSubmit = (data: FormValue) => {
    mutate(
      { data },
      {
        onSuccess: () => {
          onSent?.(getValues('email'))
        },
        onError: () => {
          toast('Error sending password reset email')
        },
      }
    )
  }

  return (
    <Form
      name="ForgottenPassword"
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-4 ${className ?? ''}`}
      data-testid="forgotten-password-form"
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reset-email" className="text-sm font-medium leading-none">
              Email address
            </label>
            <Input
              {...field}
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!fieldState.error}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        variant="default"
        disabled={!formState.isValid || !formState.isDirty || isPending}
        className="w-full h-10 mt-1"
      >
        {isPending && <Loader2 className="animate-spin" size={16} />}
        Send reset link
      </Button>
    </Form>
  )
}
