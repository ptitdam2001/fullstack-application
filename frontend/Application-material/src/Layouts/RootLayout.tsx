import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@Auth/AuthProvider'

export const RootLayout = () => {
  const { user } = useAuthContext()

  return <Navigate to={user ? 'app' : 'auth/signin'} />
}
