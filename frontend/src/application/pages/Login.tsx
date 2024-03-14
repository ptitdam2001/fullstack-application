import { Signin } from '@Authentication/components'
import { Card, PrimaryButton } from '@Common/components'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

export const Login = memo(() => {
  const navigate = useNavigate()

  const handleConnected = () => {
    navigate('/app')
  }

  return (
    <section role="login" className="w-full p-4">
      <Card direction="column">
        <Signin onConnectionDone={handleConnected} />
        <PrimaryButton to="/auth/forgotten-password">Forgotten password?</PrimaryButton>
      </Card>
    </section>
  )
})
