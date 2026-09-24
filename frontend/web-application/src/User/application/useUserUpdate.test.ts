import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useUserUpdate } from './useUserUpdate'

describe('useUserUpdate', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useUserUpdate())
    expect(result.current.isPending).toBe(false)
  })

  it('updateUser sends PATCH /user/:id with the body, isAdmin included', async () => {
    let received: { id?: string; body?: unknown } = {}
    server.use(
      http.patch('*/user/:id', async ({ params, request }) => {
        received = { id: params.id as string, body: await request.json() }
        return HttpResponse.json({})
      })
    )

    const { result } = renderHookWithProviders(() => useUserUpdate())
    await result.current.updateUser('user-1', { firstName: 'Jane', isAdmin: true })

    expect(received).toEqual({ id: 'user-1', body: { firstName: 'Jane', isAdmin: true } })
  })
})
