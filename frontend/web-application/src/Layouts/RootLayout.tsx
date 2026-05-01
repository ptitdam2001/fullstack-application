import { Navigate } from 'react-router'
import { AuthProvider } from '@Auth/application/AuthProvider'

export const RootLayout = () => {
  const { user } = AuthProvider.useAuthValue()

  return <Navigate to={user ? 'app' : 'auth/signin'} />
}
