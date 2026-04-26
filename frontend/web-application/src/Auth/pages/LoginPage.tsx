import { Card } from '@repo/design-system'
import { CONNECTED_HOME } from '@Auth/constant'
import { SigninForm } from '@Auth/Form/SigninForm'
import { Link, useNavigate } from 'react-router'

export const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <section className="flex h-full flex-col items-center justify-center">
      <Card.Container className="min-h-1/3 w-1/3">
        <Card.Header className="p-1 text-center">Login</Card.Header>
        <Card.Content className="flex flex-col gap-4 px-2 py-1">
          <SigninForm onSuccess={() => navigate(CONNECTED_HOME)} />
          <section className="text-center">
            <Link to="/auth/forgotten-password">Forgotten password</Link>
          </section>
        </Card.Content>
      </Card.Container>
    </section>
  )
}
