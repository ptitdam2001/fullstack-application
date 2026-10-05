import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Toast } from '@repo/design-system'
import type { User } from '../../domain/User'
import { useUserAvatarRemove } from '../../application/useUserAvatarRemove'

export const useAdminUserPhoto = (user: User) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { removeUserAvatar, isPending } = useUserAvatarRemove()
  // The edited user comes from the list row captured when the sheet opened: it is not refreshed by the
  // refetch that follows the removal, so the current photo is tracked here.
  const [avatar, setAvatar] = useState(user.avatar)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const confirmRemoval = async () => {
    try {
      const updated = await removeUserAvatar(user.id)
      setAvatar(updated.avatar)
      toast(intl.formatMessage({ id: 'adminUsers.toast.avatarRemoved' }))
    } catch {
      toast(intl.formatMessage({ id: 'adminUsers.toast.avatarRemoveError' }))
    } finally {
      setIsConfirmOpen(false)
    }
  }

  return {
    displayedUser: { ...user, avatar },
    hasPhoto: Boolean(avatar),
    isConfirmOpen,
    setIsConfirmOpen,
    askRemoval: () => setIsConfirmOpen(true),
    confirmRemoval,
    isPending,
  }
}
