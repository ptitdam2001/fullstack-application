import { useNavigate } from 'react-router-dom'
import { unsetAuth } from '../helpers'
import { LogoutIcon } from '@Common/components'
import { graphqlRequestClient, useLogoutUserQuery } from '@Api'

type Props = {
  redirect?: string
}

export const Signout = ({ redirect = '/' }: Props) => {
  const { refetch: doLogout } = useLogoutUserQuery(
    graphqlRequestClient,
    {},
    {
      enabled: false,
      retry: false,
      queryKey: ['logoutUser'],
    }
  )

  const navigate = useNavigate()

  const handleDisconnect = async () => {
    try {
      await doLogout()
      await unsetAuth()
      navigate(redirect)
    } catch (err) {
      console.log('Error Logout:', err)
    }
  }

  return (
    <button onClick={handleDisconnect}>
      <LogoutIcon className="w-6 h-6" />
    </button>
  )
}
