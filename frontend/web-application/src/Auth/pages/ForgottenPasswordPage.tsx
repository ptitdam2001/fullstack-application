import { Link } from 'react-router'
import { ForgottenPasswordForm } from '../ui/ForgottenPasswordForm/ForgottenPasswordForm'
import { LOGIN_PAGE } from '../domain/Auth'

export const ForgottenPasswordPage = () => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="w-full max-w-sm space-y-6">
      <ForgottenPasswordForm />
      <Link to={LOGIN_PAGE} className="block text-center text-sm text-blue-600 hover:underline">
        Retour à la connexion
      </Link>
    </div>
  </div>
)
