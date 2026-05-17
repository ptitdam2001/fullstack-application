import { useNavigate } from 'react-router'
import { useLogin, me } from '../infrastructure/useAuthApi'
import { saveAuthStorage } from '../infrastructure/authStorage'
import { AuthProvider } from './AuthProvider'
import { CONNECTED_HOME, ONBOARDING_PAGE } from '../domain/Auth'

export const useLoginAction = () => {
  const { mutateAsync: loginMutation, isPending, isError, error } = useLogin()
  const dispatch = AuthProvider.useAuthDispatch()
  const navigate = useNavigate()

  const process = async (email: string, password: string) => {
    const result = await loginMutation({ data: { email, password } })
    saveAuthStorage({ token: result.token })

    const user = await me()
    saveAuthStorage({ token: result.token, user })
    dispatch({ token: result.token, user })

    const hasTeam = user.roles?.includes('COACH') || user.roles?.includes('PLAYER')
    if (!hasTeam) {
      navigate(ONBOARDING_PAGE)
    } else {
      navigate(CONNECTED_HOME)
    }
  }

  return { process, isPending, isError, error }
}
