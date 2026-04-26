import { Card } from '@repo/design-system'
import { ForgottenPasswordForm } from '@Auth/Form/ForgottenPasswordForm'
import { Link } from 'react-router'
import { LOGIN_PAGE } from '@Auth/constant'
import { FormattedMessage } from 'react-intl'
import { ChevronLeft } from 'lucide-react'

export const ForgottenPasswordPage = () => (
  <section className="flex h-full flex-col items-center justify-center">
    <Card.Container className="min-h-1/3 w-1/3">
      <Card.Header className="flex flex-row gap-1.5 p-1">
        <Link to={LOGIN_PAGE} className="w-10">
          <ChevronLeft />
        </Link>
        <FormattedMessage id="auth.forgottenPassword" />
      </Card.Header>
      <Card.Content className="gap-3 p-3">
        <p>Please enter your email address to reset your password.</p>
        <ForgottenPasswordForm />
      </Card.Content>
    </Card.Container>
  </section>
)
