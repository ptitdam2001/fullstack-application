import { useChangeMyPassword } from '../infrastructure/useAuthApi'
import { useAuthSession } from './useAuthSession'

export const useChangeMyPasswordAction = () => {
  const { updateToken } = useAuthSession()
  const { mutateAsync, isPending } = useChangeMyPassword({
    mutation: {
      // No query depends on the password. This must stay empty: the default "invalidate everything"
      // would refetch with the token the server has just revoked → 401 → the interceptor signs the user out.
      meta: { invalidates: [] },
      // The change revokes every previous token, including the one in storage: swap it before anything else runs.
      onSuccess: ({ token }) => updateToken(token),
    },
  })

  const process = (currentPassword: string, newPassword: string) =>
    mutateAsync({ data: { currentPassword, newPassword } })

  return { process, isPending }
}
