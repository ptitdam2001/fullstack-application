import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useChangeMyPasswordAction } from './useChangeMyPasswordAction'

const mockUpdateToken = vi.fn()

vi.mock('./useAuthSession', () => ({
  useAuthSession: () => ({ updateUser: vi.fn(), updateToken: mockUpdateToken }),
}))

const tokenResponse = { token: 'fresh-jwt', userId: 'u1', email: 'jane@doe.io', isAdmin: false }

describe('useChangeMyPasswordAction', () => {
  it('sends PUT /me/password with both passwords, then swaps the session token for the fresh one', async () => {
    let body: unknown
    server.use(
      http.put('*/me/password', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(tokenResponse)
      })
    )
    const { result } = renderHookWithProviders(() => useChangeMyPasswordAction())

    await result.current.process('OldPassw0rd', 'NewPassw0rd')

    expect(body).toEqual({ currentPassword: 'OldPassw0rd', newPassword: 'NewPassw0rd' })
    expect(mockUpdateToken).toHaveBeenCalledWith('fresh-jwt')
  })

  it.each([400, 429])('throws with the HTTP status and keeps the current token on %i', async status => {
    server.use(http.put('*/me/password', () => HttpResponse.json({ message: 'Nope', status }, { status })))
    const { result } = renderHookWithProviders(() => useChangeMyPasswordAction())

    await expect(result.current.process('wrong', 'NewPassw0rd')).rejects.toMatchObject({ response: { status } })
    expect(mockUpdateToken).not.toHaveBeenCalled()
  })
})
