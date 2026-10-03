import { useId } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card, TextInputField } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { type UserWithoutPassword } from '../../domain/Account'
import { useAccountProfileForm } from './useAccountProfileForm'

type AccountProfileFormProps = {
  user: UserWithoutPassword
}

export const AccountProfileForm = ({ user }: AccountProfileFormProps) => {
  const intl = useIntl()
  const titleId = useId()
  const { Field, Form, onSubmit, isPending, canSubmit } = useAccountProfileForm(user)

  return (
    <Card.Container aria-labelledby={titleId}>
      <Card.Header>
        <Card.Title id={titleId} role="heading" aria-level={2}>
          <FormattedMessage id="account.profile.title" />
        </Card.Title>
        <Card.Description>
          <FormattedMessage id="account.profile.description" />
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form name="accountProfileForm" onSubmit={onSubmit} className="@container flex flex-col">
          {/* Side by side when the card is wide enough (container query, not viewport): shorter card */}
          <div className="grid items-start gap-x-4 @md:grid-cols-2">
            <Field name="firstName">
              {({ field, fieldState }) => (
                <TextInputField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label={intl.formatMessage({ id: 'account.profile.field.firstName' })}
                  autoComplete="given-name"
                  isRequired
                  errorMessage={
                    fieldState.error ? intl.formatMessage({ id: 'account.profile.error.firstNameRequired' }) : undefined
                  }
                />
              )}
            </Field>
            <Field name="lastName">
              {({ field }) => (
                <TextInputField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label={intl.formatMessage({ id: 'account.profile.field.lastName' })}
                  autoComplete="family-name"
                />
              )}
            </Field>
          </div>
          <dl className="grid gap-1.5 pb-6 text-sm">
            <dt className="leading-none font-medium">
              <FormattedMessage id="account.profile.field.email" />
            </dt>
            <dd data-testid="account-email">{user.email}</dd>
            <dd className="text-muted-foreground text-xs">
              <FormattedMessage id="account.profile.field.email.hint" />
            </dd>
          </dl>
          <Button type="submit" isDisabled={!canSubmit} className="self-start">
            {isPending && <Loader2 className="animate-spin" />}
            <FormattedMessage id="account.profile.submit" />
          </Button>
        </Form>
      </Card.Content>
    </Card.Container>
  )
}
