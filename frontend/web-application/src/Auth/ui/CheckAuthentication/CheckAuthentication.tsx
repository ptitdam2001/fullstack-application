import { type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { AuthProvider } from '../../application/AuthProvider'
import { LOGIN_PAGE } from '../../domain/Auth'

type CheckAuthenticationProps = {
  children: ReactNode
}

export const CheckAuthentication: React.FC<CheckAuthenticationProps> = ({ children }) => {
  const { user } = AuthProvider.useAuthValue()

  return user ? children : <Navigate to={LOGIN_PAGE} />
}
