import { useState } from 'react'
import { AuthLeftPanel } from '../ui/AuthLeftPanel'
import { ForgottenPasswordForm } from '../ui/ForgottenPasswordForm'
import { LOGIN_PAGE } from '../domain/Auth'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@repo/design-system'

const SuccessBox = ({ email, onResend }: { email: string; onResend: () => void }) => {
  const navigate = useNavigate()
  return (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
    <div
      className="flex items-start gap-3 rounded-(--radius) border p-3.5 mb-5 text-sm leading-relaxed"
      style={{
        background: 'oklch(0.95 0.04 145)',
        borderColor: 'oklch(0.8 0.08 145)',
        color: 'oklch(0.35 0.1 145)',
      }}
    >
      <Mail size={20} className="shrink-0 mt-0.5" style={{ color: 'oklch(0.5 0.12 145)' }} />
      <div>
        <strong>Check your inbox</strong>
        <br />
        We sent a password reset link to <strong>{email}</strong>. It may take a minute or two to arrive.
      </div>
    </div>

    <Button variant="default" className="w-full h-10" onPress={() => navigate(LOGIN_PAGE)}>
      Back to sign in
    </Button>

    <p className="text-center mt-4 text-sm text-muted-foreground">
      Didn&apos;t receive it?{' '}
      <button
        type="button"
        onClick={onResend}
        className="text-xs font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
        style={{ color: 'var(--auth-accent)' }}
      >
        Resend link
      </button>
    </p>
  </div>
  )
}

export const ForgottenPasswordPage = () => {
  const [sentTo, setSentTo] = useState<string | null>(null)

  return (
    <div className="grid md:grid-cols-2 h-full w-full -m-1">
      <AuthLeftPanel />

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-100">
          <Link
            to={LOGIN_PAGE}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {sentTo ? (
            <SuccessBox email={sentTo} onResend={() => setSentTo(null)} />
          ) : (
            <ForgottenPasswordForm onSent={(email) => setSentTo(email)} />
          )}
        </div>
      </div>
    </div>
  )
}
