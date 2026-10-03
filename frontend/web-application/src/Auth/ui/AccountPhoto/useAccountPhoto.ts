import { type ChangeEvent, useRef } from 'react'
import { useIntl } from 'react-intl'
import { Toast } from '@repo/design-system'
import { AVATAR_ACCEPTED_TYPES, type AvatarErrorCode } from '../../domain/Account'
import { useMyAvatarActions } from '../../application/useMyAvatarActions'

const ERROR_KEYS: Record<AvatarErrorCode, string> = {
  invalidType: 'account.photo.error.invalidType',
  unreadable: 'account.photo.error.unreadable',
  rejected: 'account.photo.error.rejected',
  generic: 'account.photo.error.generic',
}

export const useAccountPhoto = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, remove, error, isUploading, isRemoving } = useMyAvatarActions()

  const openFilePicker = () => inputRef.current?.click()

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const file = input.files?.[0]
    // Reset so that picking the same file again (e.g. after an error) fires `change` again
    input.value = ''
    if (!file) {
      return
    }
    if (await upload(file)) {
      toast.success(intl.formatMessage({ id: 'account.photo.success.updated' }))
    }
  }

  const onRemove = async () => {
    if (await remove()) {
      toast.success(intl.formatMessage({ id: 'account.photo.success.removed' }))
    }
  }

  return {
    inputRef,
    accept: AVATAR_ACCEPTED_TYPES.join(','),
    openFilePicker,
    onFileChange,
    onRemove,
    error,
    errorKey: error ? ERROR_KEYS[error] : undefined,
    isUploading,
    isRemoving,
    isBusy: isUploading || isRemoving,
  }
}
