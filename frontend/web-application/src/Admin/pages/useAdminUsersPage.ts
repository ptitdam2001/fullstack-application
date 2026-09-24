import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Toast } from '@repo/design-system'
import { AuthProvider } from '@Auth/application/AuthProvider'
import { type User, useUserDelete, useUserStatusActions } from '@User'
import type { UserAction } from '@User/ui/Admin/ConfirmUserActionDialog'

type SheetState = { open: boolean; user?: User }
type ConfirmState = { open: boolean; action?: UserAction; user?: User }

const toastKeys = {
  delete: { success: 'adminUsers.toast.deleted', error: 'adminUsers.toast.deleteError' },
  activate: { success: 'adminUsers.toast.activated', error: 'adminUsers.toast.activateError' },
  unblock: { success: 'adminUsers.toast.unblocked', error: 'adminUsers.toast.unblockError' },
} as const satisfies Record<UserAction, { success: string; error: string }>

export const useAdminUsersPage = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { user: currentUser } = AuthProvider.useAuthValue()
  const { deleteUser, isPending: isDeleting } = useUserDelete()
  const { activate, unblock, isPending: isUpdatingStatus } = useUserStatusActions()

  const [sheet, setSheet] = useState<SheetState>({ open: false })
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false })

  const mutations: Record<UserAction, (userId: string) => Promise<unknown>> = {
    delete: deleteUser,
    activate,
    unblock,
  }

  const handleConfirm = async () => {
    const { action, user } = confirm
    if (!action || !user) {
      return
    }
    try {
      await mutations[action](user.id)
      toast(intl.formatMessage({ id: toastKeys[action].success }))
      setConfirm(s => ({ ...s, open: false }))
    } catch {
      // The dialog stays open so the admin can retry or cancel
      toast(intl.formatMessage({ id: toastKeys[action].error }))
    }
  }

  return {
    currentUserId: currentUser?.id,
    sheet,
    openEdit: (user: User) => setSheet({ open: true, user }),
    closeSheet: (open: boolean) => setSheet(s => ({ ...s, open })),
    confirm,
    askConfirm: (action: UserAction, user: User) => setConfirm({ open: true, action, user }),
    closeConfirm: (open: boolean) => setConfirm(s => ({ ...s, open })),
    handleConfirm,
    isConfirmPending: isDeleting || isUpdatingStatus,
  }
}
