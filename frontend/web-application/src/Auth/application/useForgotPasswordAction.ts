import { useForgotPassword } from '../infrastructure/useAuthApi'

export const useForgotPasswordAction = () => {
  const { mutateAsync, isPending, isSuccess } = useForgotPassword()

  const process = (email: string) => mutateAsync({ data: { email } })

  return { process, isPending, isSuccess }
}
