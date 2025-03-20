import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { Auth } from './Auth'
import { LOGIN_PAGE } from './constant'

type Props = {
  children: ReactNode
}

export const AuthenticatedContent = ({ children }: Props) => {
  const { user } = Auth.useAuthValue()

  if (!user) {
    // user is not authenticated
    return <Navigate to={LOGIN_PAGE} />
  }
  return children
}
