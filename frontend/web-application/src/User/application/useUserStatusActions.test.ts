import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useUserStatusActions } from './useUserStatusActions'

describe('useUserStatusActions', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useUserStatusActions())
    expect(result.current.isPending).toBe(false)
  })

  it('activate sends PATCH /users/:userId/activate', async () => {
    let receivedId: string | undefined
    server.use(
      http.patch('*/users/:userId/activate', ({ params }) => {
        receivedId = params.userId as string
        return HttpResponse.json({})
      })
    )

    const { result } = renderHookWithProviders(() => useUserStatusActions())
    await result.current.activate('user-1')

    expect(receivedId).toBe('user-1')
  })

  it('unblock sends PATCH /users/:userId/unblock', async () => {
    let receivedId: string | undefined
    server.use(
      http.patch('*/users/:userId/unblock', ({ params }) => {
        receivedId = params.userId as string
        return HttpResponse.json({})
      })
    )

    const { result } = renderHookWithProviders(() => useUserStatusActions())
    await result.current.unblock('user-1')

    expect(receivedId).toBe('user-1')
  })
})
