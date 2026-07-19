import { type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { AuthProvider } from '../../application/AuthProvider'
import { CONNECTED_HOME } from '../../domain/Auth'
import { type UserWithoutPassword } from '@Sdk/model'

type RequireRoleProps = {
  allowed: (user: UserWithoutPassword) => boolean
  children: ReactNode
}

export const RequireRole = ({ allowed, children }: RequireRoleProps) => {
  const { user } = AuthProvider.useAuthValue()
  if (!user || !allowed(user)) {
    return <Navigate to={CONNECTED_HOME} replace />
  }
  return <>{children}</>
}
