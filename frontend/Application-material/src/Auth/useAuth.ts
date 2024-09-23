import { useCallback } from 'react'
import { useLocalStorage } from '@Hooks/useLocalstorage'

export const useAuth = () => {
  const [user, setUser] = useLocalStorage('user', null)

  const login = (login: string, password: string) => {
    setUser({ login, password })
    return Promise.resolve()
  }

  const logout = useCallback(() => {
    if (!user) {
      return Promise.reject()
    }
    setUser(null)
    return Promise.resolve()
  }, [setUser, user])

  return {
    user,
    setUser,
    login,
    logout,
  }
}
