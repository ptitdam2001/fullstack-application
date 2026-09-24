import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useUserDelete } from './useUserDelete'

describe('useUserDelete', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useUserDelete())
    expect(result.current.isPending).toBe(false)
  })

  it('deleteUser sends DELETE /user/:id', async () => {
    let receivedId: string | undefined
    server.use(
      http.delete('*/user/:id', ({ params }) => {
        receivedId = params.id as string
        return new HttpResponse(null, { status: 204 })
      })
    )

    const { result } = renderHookWithProviders(() => useUserDelete())
    await result.current.deleteUser('user-1')

    expect(receivedId).toBe('user-1')
  })
})
