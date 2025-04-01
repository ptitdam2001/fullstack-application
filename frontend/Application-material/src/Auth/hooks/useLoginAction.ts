import { AuthProvider, DEFAULT_AUTH_DATA } from '@Auth/AuthProvider'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { useLogin, useMe } from '@Sdk/authentication/authentication'

export const useLoginAction = () => {
  const dispatch = AuthProvider.useAuthDispatch()
  const [, setUser] = useLocalStorage('user', DEFAULT_AUTH_DATA)

  const meApi = useMe({ query: { enabled: false } })

  const { mutate, ...others} = useLogin({
    mutation: {
      onSuccess: async loginData => {
        const { token } = loginData

        // Do /me request to get user data
        const { data } = await meApi.refetch()

        // Save user data to local storage or state management
        setUser({ user: data, token })
        dispatch({ user: data, token })

        return loginData
      },
    },
  })

  return {
    process: (login: string, password: string) => mutate({ data: { email: login, password } }),
    ...others
  }
}
