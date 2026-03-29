import { Card } from '@repo/design-system'
import { CONNECTED_HOME } from '@Auth/constant'
import { SigninForm } from '@Auth/Form/SigninForm'
import { Link, useNavigate } from 'react-router'

export const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card.Container className="w-1/3 min-h-1/3">
        <Card.Header className="text-center p-1">Login</Card.Header>
        <Card.Content className="flex flex-col gap-4 py-1 px-2">
          <SigninForm onSuccess={() => navigate(CONNECTED_HOME)} />
          <section className="text-center">
            <Link to="/auth/forgotten-password">Forgotten password</Link>
          </section>
        </Card.Content>
      </Card.Container>
    </section>
  )
}
