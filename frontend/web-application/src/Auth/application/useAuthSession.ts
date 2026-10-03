import { useCallback } from 'react'
import { type UserWithoutPassword } from '../domain/Account'
import { readAuthStorage, saveAuthStorage } from '../infrastructure/authStorage'
import { AuthProvider } from './AuthProvider'

/**
 * Keeps the two copies of the session in sync: localStorage (read by the axios instance on every
 * request and by AuthProvider on page load) and the auth context (read by the UI).
 * Storage is read at call time rather than from a render closure, so two updates in a row
 * (e.g. avatar then profile) never overwrite each other with a stale snapshot.
 */
export const useAuthSession = () => {
  const dispatch = AuthProvider.useAuthDispatch()

  /**
   * `updated` is the user returned by a `/me` mutation. Editable fields are taken from it as is
   * (a missing `lastName` / `avatar` means it was cleared); everything else — notably the resolved
   * `roles`, which drive the sidebar — is kept when the response does not carry it.
   */
  const updateUser = useCallback(
    (updated: UserWithoutPassword) => {
      const stored = readAuthStorage()
      const user: UserWithoutPassword = {
        ...stored.user,
        ...updated,
        lastName: updated.lastName ?? undefined,
        avatar: updated.avatar ?? undefined,
      }
      saveAuthStorage({ ...stored, user })
      dispatch({ user })
      return user
    },
    [dispatch]
  )

  /** Same write order as login: storage first, so the very next request already carries the new token. */
  const updateToken = useCallback(
    (token: string) => {
      saveAuthStorage({ ...readAuthStorage(), token })
      dispatch({ token })
    },
    [dispatch]
  )

  return { updateUser, updateToken }
}
