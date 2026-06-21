import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useTeamDelete } from './useTeamDelete'

describe('useTeamDelete', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useTeamDelete())
    expect(result.current.isPending).toBe(false)
  })

  it('deleteTeam calls remove mutation and returns success', async () => {
    server.use(http.delete('/team/:id', () => HttpResponse.json(undefined, { status: 200 })))

    const { result } = renderHookWithProviders(() => useTeamDelete())
    result.current.deleteTeam('team-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
