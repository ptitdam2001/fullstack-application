import { AuthLeftPanel } from '@Auth/components/AuthLeftPanel'
import { RegisterForm } from '@Auth/Form/RegisterForm'
import { LOGIN_PAGE } from '@Auth/constant'
import { Link, useNavigate } from 'react-router'

export const RegisterPage = () => {
  const navigate = useNavigate()

  return (
    <div className="grid md:grid-cols-2 h-full w-full -m-1">
      <AuthLeftPanel
        headline={
          <>
            Join your team.
            <br />
            <strong className="font-semibold">Start competing.</strong>
          </>
        }
        subtext="Create your account and connect with your club in seconds."
      />

      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-100 py-4">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to={LOGIN_PAGE}
                className="text-sm font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
                style={{ color: 'var(--auth-accent)' }}
              >
                Sign in
              </Link>
            </p>
          </div>

          <RegisterForm onSuccess={() => navigate(LOGIN_PAGE)} />
        </div>
      </div>
    </div>
  )
}
