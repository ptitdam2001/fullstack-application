import { useRegister } from '../infrastructure/useAuthApi'
import type { RegisterInput } from '../infrastructure/useAuthApi'

export const useRegisterAction = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useRegister()

  const process = (input: RegisterInput) => mutateAsync({ data: input })

  return { process, isPending, isSuccess, isError, error }
}
