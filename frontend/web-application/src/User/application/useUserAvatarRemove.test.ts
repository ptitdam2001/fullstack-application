import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useUserAvatarRemove } from './useUserAvatarRemove'

describe('useUserAvatarRemove', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useUserAvatarRemove())
    expect(result.current.isPending).toBe(false)
  })

  it('removeUserAvatar sends DELETE /user/:id/avatar and resolves with the updated user', async () => {
    let receivedId: string | undefined
    server.use(
      http.delete('*/user/:id/avatar', ({ params }) => {
        receivedId = params.id as string
        return HttpResponse.json({ id: 'user-1', firstName: 'Jane', avatar: null })
      })
    )

    const { result } = renderHookWithProviders(() => useUserAvatarRemove())
    const updated = await result.current.removeUserAvatar('user-1')

    expect(receivedId).toBe('user-1')
    expect(updated).toMatchObject({ id: 'user-1', avatar: null })
  })
})
