import { Navigate } from 'react-router'
import { Auth } from '@Auth/Auth'

export const RootLayout = () => {
  const { user } = Auth.useAuthValue()

  return <Navigate to={user ? 'app' : 'auth/signin'} />
}
