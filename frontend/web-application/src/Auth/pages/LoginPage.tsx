import { Link } from 'react-router'
import { AuthLeftPanel } from '../ui/AuthLeftPanel/AuthLeftPanel'
import { SigninForm } from '../ui/SigninForm/SigninForm'
import { REGISTER_PAGE } from '../domain/Auth'

export const LoginPage = () => (
  <div className="grid h-full md:grid-cols-2">
    <AuthLeftPanel />
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <SigninForm forgotPasswordHref="/auth/forgotten-password" />
        <p className="text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to={REGISTER_PAGE} className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  </div>
)
