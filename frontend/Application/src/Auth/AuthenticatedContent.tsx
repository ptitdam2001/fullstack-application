import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'
import { LOGIN_PAGE } from './constant'

type Props = {
  children: ReactNode
}

export const AuthenticatedContent = ({ children }: Props) => {
  const { user } = useAuthContext()

  if (!user) {
    // user is not authenticated
    return <Navigate to={LOGIN_PAGE} />
  }
  return children
}
