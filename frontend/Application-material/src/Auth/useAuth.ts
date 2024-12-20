import { useCallback } from 'react'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { useLogin } from '@Sdk/sdk'

export const useAuth = () => {
  const [user, setUser] = useLocalStorage('user', null)
  const { mutate } = useLogin()

  const login = async (login: string, password: string) => {
    const data = await mutate({ data: {  email: login, password } })
    console.log('>>>>>>', data)
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
