import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { LOGIN_PAGE } from '@Auth/constant'
import { AuthProvider } from '@Auth/AuthProvider'

type CheckAuthenticationProps = {
  children: ReactNode
}

export const CheckAuthentication: React.FC<CheckAuthenticationProps> = ({ children }) => {
  const { user } = AuthProvider.useAuthValue()

  return user ? children : <Navigate to={LOGIN_PAGE} />
}
