import { type ComponentProps, useId } from 'react'
import { useIntl } from 'react-intl'
import { Label, PasswordInput } from '@repo/design-system'

type PasswordFieldProps = Omit<ComponentProps<typeof PasswordInput>, 'id' | 'aria-invalid' | 'aria-describedby'> & {
  label: string
  /** Already translated error — shown instead of the hint */
  error?: string
  hint?: string
}

export const PasswordField = ({ label, error, hint, ...inputProps }: PasswordFieldProps) => {
  const intl = useIntl()
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className="grid w-full items-center gap-1.5 pb-4" data-invalid={Boolean(error)}>
      <Label htmlFor={id}>{label}</Label>
      <PasswordInput
        {...inputProps}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        showPasswordLabel={intl.formatMessage({ id: 'account.password.show' })}
        hidePasswordLabel={intl.formatMessage({ id: 'account.password.hide' })}
      />
      {message && (
        <p id={messageId} className={error ? 'text-destructive text-sm' : 'text-muted-foreground text-xs'}>
          {message}
        </p>
      )}
    </div>
  )
}
