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
    let receivedBody: unknown
    server.use(
      http.post('*/team', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json('new-team-id')
      })
    )

    const { result } = renderHookWithProviders(() => useTeamForm())
    result.current.submit({ name: 'Test Team', color: '#ff0000' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedBody).toMatchObject({ name: 'Test Team', color: '#ff0000' })
  })

  it('submit with teamId calls update mutation', async () => {
    let receivedId: string | undefined
    let receivedBody: unknown
    server.use(
      http.patch('*/team/:id', async ({ params, request }) => {
        receivedId = params.id as string
        receivedBody = await request.json()
        return HttpResponse.json({ id: '1', name: 'Updated', color: '#0000ff', areas: [] })
      })
    )

    const { result } = renderHookWithProviders(() => useTeamForm())
    result.current.submit({ name: 'Updated', color: '#0000ff' }, '1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedId).toBe('1')
    expect(receivedBody).toMatchObject({ id: '1', name: 'Updated', color: '#0000ff' })
  })
})
