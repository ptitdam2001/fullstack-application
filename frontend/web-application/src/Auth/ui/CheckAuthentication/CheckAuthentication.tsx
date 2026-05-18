import { type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { AuthProvider } from '../../application/AuthProvider'
import { LOGIN_PAGE } from '../../domain/Auth'

type CheckAuthenticationProps = {
  children: ReactNode
}

export const CheckAuthentication = ({ children }: CheckAuthenticationProps) => {
  const { user } = AuthProvider.useAuthValue()
  if (!user) {
    return <Navigate to={LOGIN_PAGE} replace />
  }
  return <>{children}</>
}
