import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'

const mockDispatch = vi.fn()

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(() => ({ user: undefined, token: undefined })),
    useAuthDispatch: vi.fn(() => mockDispatch),
  },
}))

import { useLoginAction } from './useLoginAction'

const mockUser = { id: '1', email: 'test@test.com', firstname: 'Test', lastname: 'User', role: 'PLAYER' }

describe('useLoginAction', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useLoginAction())
    expect(result.current.isPending).toBe(false)
  })

  it('sets success after valid login + me', async () => {
    server.use(
      http.post('*/login', () => HttpResponse.json({ token: 'fake-token' })),
      http.get('*/me', () => HttpResponse.json(mockUser))
    )

    const { result } = renderHookWithProviders(() => useLoginAction())
    result.current.process('test@test.com', 'password123')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('sets error on login failure', async () => {
    server.use(http.post('*/login', () => HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })))

    const { result } = renderHookWithProviders(() => useLoginAction())
    result.current.process('bad@test.com', 'wrong')

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
