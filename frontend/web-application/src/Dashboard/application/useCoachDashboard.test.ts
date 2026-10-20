import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCoachDashboard } from './useCoachDashboard'

const mockUseGetCoachTeams = vi.fn()

vi.mock('@Sdk/user-team/user-team', () => ({
  useGetCoachTeams: (...args: unknown[]) => mockUseGetCoachTeams(...args),
}))
vi.mock('@Sdk/teams/teams', () => ({ useGetTeams: () => ({ data: [] }) }))
vi.mock('@Sdk/match/match', () => ({ useGetMatches: () => ({ data: [] }) }))

describe('useCoachDashboard', () => {
  beforeEach(() => {
    mockUseGetCoachTeams.mockReset().mockReturnValue({ data: [] })
  })

  // The signed-in user is not known yet on the first render: requesting GET /user//coach-teams would fail.
  it('does not request the coach teams without a user id', () => {
    renderHook(() => useCoachDashboard(''))
    expect(mockUseGetCoachTeams).toHaveBeenCalledWith('', { query: { enabled: false } })
  })

  it('requests the coach teams of the user', () => {
    renderHook(() => useCoachDashboard('user-1'))
    expect(mockUseGetCoachTeams).toHaveBeenCalledWith('user-1', { query: { enabled: true } })
  })
})
