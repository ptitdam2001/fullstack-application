import { SigninForm } from '@Auth/Form/SigninForm'
import { Card, CardContent } from '@mui/material'
import { Link } from 'react-router'

export const LoginPage = () => {
  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card className="w-1/3 min-h-1/3">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-center">Login</h2>
          <SigninForm />
          <Link to="/auth/forgotten-password">Forgotten password</Link>
        </CardContent>
      </Card>
    </section>
  )
}
