import { useState } from 'react'
import { type AvatarErrorCode, isAcceptedAvatarType } from '../domain/Account'
import { resizeImageToJpegBase64 } from '../infrastructure/resizeImage'
import { getMeQueryKey, useRemoveMyAvatar, useUpdateMyAvatar } from '../infrastructure/useAuthApi'
import { useAuthSession } from './useAuthSession'

const toServerErrorCode = (err: unknown): AvatarErrorCode => {
  const status = (err as { response?: { status?: number } })?.response?.status
  return status === 400 ? 'rejected' : 'generic'
}

export const useMyAvatarActions = () => {
  const { updateUser } = useAuthSession()
  const [error, setError] = useState<AvatarErrorCode | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const meta = { invalidates: [getMeQueryKey()] }
  const uploadMutation = useUpdateMyAvatar({ mutation: { meta } })
  const removeMutation = useRemoveMyAvatar({ mutation: { meta } })

  /** Resolves to true when the picture was saved; on failure `error` holds the reason. */
  const upload = async (file: Blob): Promise<boolean> => {
    setError(null)
    if (!isAcceptedAvatarType(file.type)) {
      setError('invalidType')
      return false
    }

    let data: string
    setIsProcessing(true)
    try {
      data = await resizeImageToJpegBase64(file)
    } catch {
      setError('unreadable')
      return false
    } finally {
      setIsProcessing(false)
    }

    try {
      // The resize step always re-encodes to JPEG, whatever the source format
      updateUser(await uploadMutation.mutateAsync({ data: { contentType: 'image/jpeg', data } }))
      return true
    } catch (err: unknown) {
      setError(toServerErrorCode(err))
      return false
    }
  }

  const remove = async (): Promise<boolean> => {
    setError(null)
    try {
      updateUser(await removeMutation.mutateAsync())
      return true
    } catch (err: unknown) {
      setError(toServerErrorCode(err))
      return false
    }
  }

  return {
    upload,
    remove,
    error,
    isUploading: isProcessing || uploadMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
