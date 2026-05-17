import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Layout } from '@repo/design-system'
import { ForgottenPasswordForm } from '../ui/ForgottenPasswordForm/ForgottenPasswordForm'
import { LOGIN_PAGE } from '../domain/Auth'

export const ForgottenPasswordPage = () => (
  <Layout.Root>
    <Layout.Content align="center">
      <div className="w-full max-w-sm space-y-6 py-8">
        <ForgottenPasswordForm />
        <Link to={LOGIN_PAGE} className="block text-center text-sm text-blue-600 hover:underline">
          <FormattedMessage id="auth.backToLogin" />
        </Link>
      </div>
    </Layout.Content>
  </Layout.Root>
)
