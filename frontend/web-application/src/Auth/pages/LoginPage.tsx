import { CONNECTED_HOME } from '../domain/Auth'
import { AuthLeftPanel } from '../ui/AuthLeftPanel'
import { SigninForm } from '../ui/SigninForm'
import { Link, useNavigate } from 'react-router'

export const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="grid md:grid-cols-2 h-full w-full -m-1">
      <AuthLeftPanel />

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-100">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue.</p>
          </div>

          <SigninForm onSuccess={() => navigate(CONNECTED_HOME)} forgotPasswordPath="/auth/forgotten-password" />

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/register"
              className="text-sm font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
              style={{ color: 'var(--auth-accent)' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
