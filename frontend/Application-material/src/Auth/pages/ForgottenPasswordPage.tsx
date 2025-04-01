import { ForgottenPasswordForm } from '@Auth/Form/ForgottenPasswordForm'
import { Card, CardContent } from '@mui/material'

export const ForgottenPasswordPage = () => {
  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card className="w-1/3 min-h-1/3">
        <CardContent>
          <h2>Forgotten Password</h2>

          <p>Please enter your email address to reset your password.</p>
          <ForgottenPasswordForm />
        </CardContent>
      </Card>
    </section>
  )
}
