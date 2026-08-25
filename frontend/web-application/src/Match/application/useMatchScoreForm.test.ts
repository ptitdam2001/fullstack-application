import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { MatchStatus } from '../domain/Match'
import type { Match } from '../domain/Match'
import { useMatchScoreForm } from './useMatchScoreForm'

const match: Match = {
  id: 'match-1',
  area: { id: 'area-1', name: 'Salle A', address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
}

describe('useMatchScoreForm', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useMatchScoreForm(match))
    expect(result.current.isPending).toBe(false)
  })

  it('submitScore sends the match with the score and PLAYED status, and succeeds', async () => {
    let receivedBody: unknown
    server.use(
      http.patch('/match/:id', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ ...match, status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 })
      })
    )

    const { result } = renderHookWithProviders(() => useMatchScoreForm(match))
    result.current.submitScore({ homeGoals: 3, awayGoals: 1 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(receivedBody).toMatchObject({
      homeTeamId: 'team-1',
      awayTeamId: 'team-2',
      status: MatchStatus.PLAYED,
      homeGoals: 3,
      awayGoals: 1,
    })
  })
})
