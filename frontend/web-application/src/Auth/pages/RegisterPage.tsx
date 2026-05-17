import { Link } from 'react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import { Layout } from '@repo/design-system'
import { AuthLeftPanel } from '../ui/AuthLeftPanel/AuthLeftPanel'
import { RegisterForm } from '../ui/RegisterForm/RegisterForm'
import { LOGIN_PAGE } from '../domain/Auth'

export const RegisterPage = () => {
  const intl = useIntl()
  return (
    <Layout.Root>
      <Layout.Content>
        <div className="grid flex-1 md:grid-cols-2">
          <AuthLeftPanel
            headline={intl.formatMessage({ id: 'onboarding.createTeam.title' })}
            subtext={intl.formatMessage({ id: 'onboarding.createTeam.description' })}
          />
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-6">
              <RegisterForm />
              <p className="text-center text-sm text-slate-500">
                <FormattedMessage id="auth.alreadyAccount" />{' '}
                <Link to={LOGIN_PAGE} className="text-blue-600 hover:underline">
                  <FormattedMessage id="auth.signin" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}
