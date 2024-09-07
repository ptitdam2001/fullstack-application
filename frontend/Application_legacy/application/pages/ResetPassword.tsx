import { useNavigate } from 'react-router-dom'

import { ResetPassword as ResetPasswordComponent } from '@Authentication/components'
import { Card } from '@Common/components'
import { memo } from 'react'

export const ResetPassword = memo(() => {
  const navigate = useNavigate()

  const handleResetPasswordSucceed = () => {
    navigate('/auth/signin')
  }

  return (
    <section role="reset-password" className="flex flex-col w-full p-4">
      <Card direction="column">
        <ResetPasswordComponent onSuccess={handleResetPasswordSucceed} />
      </Card>
    </section>
  )
})
