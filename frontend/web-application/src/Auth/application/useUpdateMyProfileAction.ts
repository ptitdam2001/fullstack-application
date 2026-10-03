import { type UpdateMyProfileInput } from '../domain/Account'
import { getMeQueryKey, useUpdateMyProfile } from '../infrastructure/useAuthApi'
import { useAuthSession } from './useAuthSession'

export const useUpdateMyProfileAction = () => {
  const { updateUser } = useAuthSession()
  const { mutateAsync, isPending } = useUpdateMyProfile({ mutation: { meta: { invalidates: [getMeQueryKey()] } } })

  const process = async (input: UpdateMyProfileInput) => {
    const user = await mutateAsync({ data: input })
    return updateUser(user)
  }

  return { process, isPending }
}
