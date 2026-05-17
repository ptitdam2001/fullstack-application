import { useNavigate } from 'react-router'
import { useResetPassword } from '../infrastructure/useAuthApi'
import { LOGIN_PAGE } from '../domain/Auth'

export const useResetPasswordAction = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useResetPassword()
  const navigate = useNavigate()

  const process = async (token: string, newPassword: string) => {
    await mutateAsync({ data: { token, newPassword } })
    navigate(LOGIN_PAGE)
  }

  return { process, isPending, isSuccess, isError, error }
}
