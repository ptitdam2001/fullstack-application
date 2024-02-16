import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@Authentication/hooks'

type Props = {
  children: JSX.Element
  signinPath: string
  connectedMainPath: string
}

export const AuthenticationProvider = ({ children, signinPath, connectedMainPath }: Props) => {
  const navigate = useNavigate()
  const { user, error, fetching } = useCurrentUser()

  useEffect(() => {
    /** @todo - check user is authenticated - redirect to signin or main */
    if (!fetching && (error || !user)) {
      navigate(signinPath)
    }

    if (!fetching && user) {
      navigate(connectedMainPath)
    }
  }, [error, fetching, user])

  if (fetching) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Oh no...</p>
  }

  return children
}
