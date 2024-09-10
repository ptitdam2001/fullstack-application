import { useEffect } from 'react'
import { useAuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom'
import { LOGIN_PAGE } from './constant'

export const Logout = () => {
  const { logout } = useAuthContext()

  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to={LOGIN_PAGE} />
}
