import { Link } from 'react-router'
import { AuthLeftPanel } from '../ui/AuthLeftPanel/AuthLeftPanel'
import { RegisterForm } from '../ui/RegisterForm/RegisterForm'
import { LOGIN_PAGE } from '../domain/Auth'

export const RegisterPage = () => (
  <div className="grid h-full md:grid-cols-2">
    <AuthLeftPanel headline="Rejoignez l'équipe" subtext="Créez votre compte en quelques secondes." />
    <div className="flex items-center justify-center overflow-y-auto p-8">
      <div className="w-full max-w-sm space-y-6">
        <RegisterForm />
        <p className="text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link to={LOGIN_PAGE} className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  </div>
)
