import { useActivateAccount } from '../infrastructure/useAuthApi'

export const useActivateAction = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useActivateAccount()

  const process = (token: string) => mutateAsync({ data: { token } })

  return { process, isPending, isSuccess, isError, error }
}
