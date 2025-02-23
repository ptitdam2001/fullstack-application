import { useEffect } from 'react'
import { Auth } from './Auth'
import { Navigate } from 'react-router-dom'
import { LOGIN_PAGE } from './constant'

export const Logout = () => {
  const { logout } = Auth.useAuthValue()

  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to={LOGIN_PAGE} />
}
