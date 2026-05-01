import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'
import { useLogin, me } from '../infrastructure/useAuthApi'
import { AuthProvider } from './AuthProvider'

export const useLoginAction = () => {
  const dispatch = AuthProvider.useAuthDispatch()
  const [, setUser] = useLocalStorage('user', DEFAULT_AUTH_DATA)

  const { mutate, ...others } = useLogin({
    mutation: {
      onSuccess: async ({ token }) => {
        // Write token to localStorage directly so getAxiosConfig() picks it up
        // without triggering a re-render before /me completes
        setUser({ user: undefined, token })

        const userData = await me()

        setUser({ user: userData, token })
        dispatch({ user: userData, token })
      },
    },
  })

  return {
    process: (login: string, password: string) => mutate({ data: { email: login, password } }),
    ...others,
  }
}
