import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Layout } from '@repo/design-system'
import { AuthLeftPanel } from '../ui/AuthLeftPanel/AuthLeftPanel'
import { SigninForm } from '../ui/SigninForm/SigninForm'
import { REGISTER_PAGE } from '../domain/Auth'

export const LoginPage = () => (
  <Layout.Root>
    <Layout.Content>
      <div className="grid flex-1 md:grid-cols-2">
        <AuthLeftPanel />
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
            <SigninForm forgotPasswordHref="/auth/forgotten-password" />
            <p className="text-center text-sm text-slate-500">
              <FormattedMessage id="auth.noAccount" />{' '}
              <Link to={REGISTER_PAGE} className="text-blue-600 hover:underline">
                <FormattedMessage id="auth.createAccount" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout.Content>
  </Layout.Root>
)
