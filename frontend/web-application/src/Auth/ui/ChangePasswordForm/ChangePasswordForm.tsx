import { useId } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Alert, AlertDescription, Button, Card } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { PasswordField } from './components/PasswordField'
import { useChangePasswordForm } from './useChangePasswordForm'

export const ChangePasswordForm = () => {
  const intl = useIntl()
  const titleId = useId()
  const { Field, Form, onSubmit, isPending, submitError, submitErrorKey } = useChangePasswordForm()

  return (
    <Card.Container aria-labelledby={titleId}>
      <Card.Header>
        <Card.Title id={titleId} role="heading" aria-level={2}>
          <FormattedMessage id="account.password.title" />
        </Card.Title>
        <Card.Description>
          <FormattedMessage id="account.password.description" />
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form name="changePasswordForm" onSubmit={onSubmit} className="@container flex flex-col">
          {/* New password and its confirmation side by side when the card is wide enough (container query) */}
          <div className="grid items-start gap-x-4 @md:grid-cols-2">
            <div className="@md:col-span-2 @md:w-[calc(50%-0.5rem)]">
              <Field name="currentPassword">
                {({ field, fieldState }) => (
                  <PasswordField
                    {...field}
                    label={intl.formatMessage({ id: 'account.password.field.currentPassword' })}
                    autoComplete="current-password"
                    error={
                      fieldState.error
                        ? intl.formatMessage({ id: 'account.password.error.currentPasswordRequired' })
                        : undefined
                    }
                  />
                )}
              </Field>
            </div>
            <Field name="newPassword">
              {({ field, fieldState }) => (
                <PasswordField
                  {...field}
                  label={intl.formatMessage({ id: 'account.password.field.newPassword' })}
                  autoComplete="new-password"
                  hint={intl.formatMessage({ id: 'account.password.field.newPassword.hint' })}
                  error={
                    fieldState.error ? intl.formatMessage({ id: 'account.password.error.newPasswordRules' }) : undefined
                  }
                />
              )}
            </Field>
            <Field name="confirmPassword">
              {({ field, fieldState }) => (
                <PasswordField
                  {...field}
                  label={intl.formatMessage({ id: 'account.password.field.confirmPassword' })}
                  autoComplete="new-password"
                  error={fieldState.error ? intl.formatMessage({ id: 'account.password.error.mismatch' }) : undefined}
                />
              )}
            </Field>
          </div>
          {submitErrorKey && (
            <Alert variant="destructive" data-error={submitError} className="mb-4">
              <AlertDescription className="text-destructive">
                <FormattedMessage id={submitErrorKey} />
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" isDisabled={isPending} className="self-start">
            {isPending && <Loader2 className="animate-spin" />}
            <FormattedMessage id="account.password.submit" />
          </Button>
        </Form>
      </Card.Content>
    </Card.Container>
  )
}
