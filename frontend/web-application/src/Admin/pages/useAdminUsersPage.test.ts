import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@User'
import { useAdminUsersPage } from './useAdminUsersPage'

const deleteUser = vi.fn()
const activate = vi.fn()
const unblock = vi.fn()
const toast = vi.fn()

vi.mock('@User', () => ({
  useUserDelete: () => ({ deleteUser, isPending: false }),
  useUserStatusActions: () => ({ activate, unblock, isPending: false }),
}))
vi.mock('@repo/design-system', async importOriginal => ({
  ...(await importOriginal<object>()),
  Toast: { useToast: () => toast },
}))
vi.mock('@Auth/application/AuthProvider', () => ({
  AuthProvider: { useAuthValue: () => ({ user: { id: 'admin-1' } }) },
}))

const user: User = {
  id: 'u-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  isAdmin: false,
  isActive: false,
  isBlocked: false,
  isReferee: false,
}

describe('useAdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes the authenticated admin id', () => {
    const { result } = renderHook(() => useAdminUsersPage())
    expect(result.current.currentUserId).toBe('admin-1')
  })

  it('opens and closes the edit sheet for a user', () => {
    const { result } = renderHook(() => useAdminUsersPage())
    act(() => result.current.openEdit(user))
    expect(result.current.sheet).toEqual({ open: true, user })

    act(() => result.current.closeSheet(false))
    expect(result.current.sheet.open).toBe(false)
  })

  it.each([
    ['delete', deleteUser, 'adminUsers.toast.deleted'],
    ['activate', activate, 'adminUsers.toast.activated'],
    ['unblock', unblock, 'adminUsers.toast.unblocked'],
  ] as const)('confirms %s: calls the mutation, toasts and closes', async (action, mutation, toastKey) => {
    mutation.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAdminUsersPage())
    act(() => result.current.askConfirm(action, user))
    expect(result.current.confirm).toEqual({ open: true, action, user })

    await act(() => result.current.handleConfirm())

    expect(mutation).toHaveBeenCalledWith('u-1')
    expect(toast).toHaveBeenCalledWith(toastKey)
    expect(result.current.confirm.open).toBe(false)
  })

  it('keeps the dialog open and toasts the error when the mutation fails', async () => {
    deleteUser.mockRejectedValue(new Error('403'))
    const { result } = renderHook(() => useAdminUsersPage())
    act(() => result.current.askConfirm('delete', user))

    await act(() => result.current.handleConfirm())

    expect(toast).toHaveBeenCalledWith('adminUsers.toast.deleteError')
    expect(result.current.confirm.open).toBe(true)
  })
})
