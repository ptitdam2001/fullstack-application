import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useMatchDelete } from './useMatchDelete'

describe('useMatchDelete', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useMatchDelete())
    expect(result.current.isPending).toBe(false)
  })

  it('deleteMatch calls DELETE /match/:id and succeeds', async () => {
    let receivedId: string | undefined
    server.use(
      http.delete('/match/:id', ({ params }) => {
        receivedId = params.id as string
        return HttpResponse.json({})
      })
    )

    const { result } = renderHookWithProviders(() => useMatchDelete())
    result.current.deleteMatch('match-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedId).toBe('match-1')
  })
})
