import { useResendActivation } from '../infrastructure/useAuthApi'

export const useResendActivationAction = () => {
  const { mutateAsync, isPending } = useResendActivation()

  const process = (email: string) => mutateAsync({ data: { email } })

  return { process, isPending }
}
