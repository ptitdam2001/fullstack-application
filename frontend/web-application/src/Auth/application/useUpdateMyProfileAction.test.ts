import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useUpdateMyProfileAction } from './useUpdateMyProfileAction'

const mockUpdateUser = vi.fn()

vi.mock('./useAuthSession', () => ({
  useAuthSession: () => ({ updateUser: mockUpdateUser, updateToken: vi.fn() }),
}))

const updatedUser = { id: 'u1', email: 'jane@doe.io', firstName: 'Janet' }

describe('useUpdateMyProfileAction', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useUpdateMyProfileAction())
    expect(result.current.isPending).toBe(false)
  })

  it('sends PATCH /me with the body — lastName null included — then refreshes the session user', async () => {
    let body: unknown
    server.use(
      http.patch('*/me', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(updatedUser)
      })
    )
    const { result } = renderHookWithProviders(() => useUpdateMyProfileAction())

    await result.current.process({ firstName: 'Janet', lastName: null })

    expect(body).toEqual({ firstName: 'Janet', lastName: null })
    expect(mockUpdateUser).toHaveBeenCalledWith(updatedUser)
  })

  it('throws and leaves the session untouched when the API fails', async () => {
    server.use(http.patch('*/me', () => HttpResponse.json({ message: 'Bad request', status: 400 }, { status: 400 })))
    const { result } = renderHookWithProviders(() => useUpdateMyProfileAction())

    await expect(result.current.process({ firstName: '' })).rejects.toThrow()
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })
})
