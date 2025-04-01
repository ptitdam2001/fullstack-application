import { CONNECTED_HOME } from '@Auth/constant'
import { SigninForm } from '@Auth/Form/SigninForm'
import { Card, CardContent } from '@mui/material'
import { Link, useNavigate } from 'react-router'

export const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card className="w-1/3 min-h-1/3">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-center">Login</h2>
          <SigninForm onSuccess={() => navigate(CONNECTED_HOME)} />
          <Link to="/auth/forgotten-password">Forgotten password</Link>
        </CardContent>
      </Card>
    </section>
  )
}
