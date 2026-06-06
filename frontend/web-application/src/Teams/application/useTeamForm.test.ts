import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useTeamForm } from './useTeamForm'

describe('useTeamForm', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useTeamForm())
    expect(result.current.isPending).toBe(false)
  })

  it('submit without teamId calls create mutation', async () => {
    server.use(http.post('/team', () => HttpResponse.json('new-team-id')))

    const { result } = renderHookWithProviders(() => useTeamForm())
    result.current.submit({ name: 'Test Team', color: '#ff0000' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('submit with teamId calls update mutation', async () => {
    server.use(
      http.put('/team/:id', () => HttpResponse.json({ id: '1', name: 'Updated', color: '#0000ff', areas: [] }))
    )

    const { result } = renderHookWithProviders(() => useTeamForm())
    result.current.submit({ name: 'Updated', color: '#0000ff', id: '1' }, '1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
