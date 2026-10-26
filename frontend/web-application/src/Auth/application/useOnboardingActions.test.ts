import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useOnboardingActions } from './useOnboardingActions'

describe('useOnboardingActions', () => {
  it('starts with no action pending', () => {
    const { result } = renderHookWithProviders(() => useOnboardingActions())
    expect(result.current.isRefereePending).toBe(false)
    expect(result.current.isJoinPending).toBe(false)
    expect(result.current.isCreatePending).toBe(false)
  })

  it('declares the current user as a referee', async () => {
    let called = false
    server.use(
      http.post('*/me/referee', () => {
        called = true
        return new HttpResponse(null, { status: 204 })
      })
    )
    const { result } = renderHookWithProviders(() => useOnboardingActions())

    await result.current.declareReferee()

    expect(called).toBe(true)
  })

  it('sends a join request for the team with the requested role', async () => {
    let teamId: unknown
    let body: unknown
    server.use(
      http.post('*/teams/:teamId/join-requests', async ({ params, request }) => {
        teamId = params.teamId
        body = await request.json()
        return HttpResponse.json({}, { status: 201 })
      })
    )
    const { result } = renderHookWithProviders(() => useOnboardingActions())

    await result.current.joinTeam('team-1', 'COACH')

    expect(teamId).toBe('team-1')
    expect(body).toEqual({ requestedRole: 'COACH' })
  })

  it('creates a team with its name, a black color and no area', async () => {
    let body: unknown
    server.use(
      http.post('*/teams/with-coach', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({}, { status: 201 })
      })
    )
    const { result } = renderHookWithProviders(() => useOnboardingActions())

    await result.current.createTeam('Les Aigles')

    expect(body).toEqual({ name: 'Les Aigles', color: '#000000', areas: [] })
  })
})
