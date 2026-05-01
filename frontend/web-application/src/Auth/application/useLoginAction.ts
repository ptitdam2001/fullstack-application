import { saveAuthStorage } from '../infrastructure/authStorage'
import { useLogin, me } from '../infrastructure/useAuthApi'
import { AuthProvider } from './AuthProvider'

export const useLoginAction = () => {
  const dispatch = AuthProvider.useAuthDispatch()

  const { mutate, ...others } = useLogin({
    mutation: {
      onSuccess: async ({ token }) => {
        // Write token to localStorage before /me so getAxiosConfig() picks it up
        saveAuthStorage({ user: undefined, token })

        const userData = await me()

        saveAuthStorage({ user: userData, token })
        dispatch({ user: userData, token })
      },
    },
  })

  return {
    process: (login: string, password: string) => mutate({ data: { email: login, password } }),
    ...others,
  }
}
