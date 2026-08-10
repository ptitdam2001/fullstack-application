import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MatchMode } from '../domain/Group'
import { PhaseType } from '../domain/Phase'

const navigate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('../infrastructure/useChampionshipApi', () => ({ useUpdateChampionship: vi.fn() }))
vi.mock('../infrastructure/useGroupApi', () => ({ useCreateGroup: vi.fn(), useGenerateGroupMatches: vi.fn() }))
vi.mock('../infrastructure/useBracketApi', () => ({ useCreateBracket: vi.fn(), useGenerateBracketMatches: vi.fn() }))

import { useUpdateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreateGroup, useGenerateGroupMatches } from '../infrastructure/useGroupApi'
import { useCreateBracket, useGenerateBracketMatches } from '../infrastructure/useBracketApi'
import { useChampionshipWizardFinalSubmit } from './useChampionshipWizardFinalSubmit'

const mockedUseUpdateChampionship = vi.mocked(useUpdateChampionship)
const mockedUseCreateGroup = vi.mocked(useCreateGroup)
const mockedUseGenerateGroupMatches = vi.mocked(useGenerateGroupMatches)
const mockedUseCreateBracket = vi.mocked(useCreateBracket)
const mockedUseGenerateBracketMatches = vi.mocked(useGenerateBracketMatches)

const mutateAsyncUpdate = vi.fn()
const mutateAsyncCreateGroup = vi.fn()
const mutateAsyncGenerateGroupMatches = vi.fn()
const mutateAsyncCreateBracket = vi.fn()
const mutateAsyncGenerateBracketMatches = vi.fn()

const groupWizard = {
  championshipId: 'champ-1',
  phaseId: 'phase-1',
  phaseType: PhaseType.GROUP,
  categoryId: 'c1',
  seasonId: 's1',
  name: 'Championnat U13',
  points: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  groups: [{ id: 'g1', name: 'Poule A', teamIds: ['t1', 't2'], matchMode: MatchMode.SINGLE, generated: false }],
  teamIds: [] as string[],
}

const knockoutWizard = {
  championshipId: 'champ-1',
  phaseId: 'phase-1',
  phaseType: PhaseType.KNOCKOUT,
  categoryId: 'c1',
  seasonId: 's1',
  name: 'Championnat U13',
  points: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  groups: [],
  teamIds: ['t1', 't2'],
}

describe('useChampionshipWizardFinalSubmit', () => {
  beforeEach(() => {
    navigate.mockReset()
    mutateAsyncUpdate.mockReset()
    mutateAsyncCreateGroup.mockReset()
    mutateAsyncGenerateGroupMatches.mockReset()
    mutateAsyncCreateBracket.mockReset()
    mutateAsyncGenerateBracketMatches.mockReset()

    mockedUseUpdateChampionship.mockReturnValue({ mutateAsync: mutateAsyncUpdate } as never)
    mockedUseCreateGroup.mockReturnValue({ mutateAsync: mutateAsyncCreateGroup } as never)
    mockedUseGenerateGroupMatches.mockReturnValue({ mutateAsync: mutateAsyncGenerateGroupMatches } as never)
    mockedUseCreateBracket.mockReturnValue({ mutateAsync: mutateAsyncCreateBracket } as never)
    mockedUseGenerateBracketMatches.mockReturnValue({ mutateAsync: mutateAsyncGenerateBracketMatches } as never)

    mutateAsyncUpdate.mockResolvedValue({ id: 'champ-1' })
    mutateAsyncCreateGroup.mockResolvedValue({ id: 'group-1' })
    mutateAsyncGenerateGroupMatches.mockResolvedValue([])
    mutateAsyncCreateBracket.mockResolvedValue({ id: 'bracket-1' })
    mutateAsyncGenerateBracketMatches.mockResolvedValue([])
  })

  it('GROUP: updates points, creates each group, generates matches, then navigates', async () => {
    const { result } = renderHook(() => useChampionshipWizardFinalSubmit(groupWizard as never))

    await act(async () => result.current.handleSubmit())

    expect(mutateAsyncUpdate).toHaveBeenCalledWith({
      id: 'champ-1',
      data: {
        name: 'Championnat U13',
        ageCategoryId: 'c1',
        seasonId: 's1',
        pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
      },
    })
    expect(mutateAsyncCreateGroup).toHaveBeenCalledWith({
      data: { phaseId: 'phase-1', name: 'Poule A', matchMode: MatchMode.SINGLE, teamIds: ['t1', 't2'] },
    })
    expect(mutateAsyncGenerateGroupMatches).toHaveBeenCalledWith({ id: 'group-1' })
    expect(navigate).toHaveBeenCalledWith('/app/admin/championships')
  })

  it('KNOCKOUT: creates the bracket with seeded bracketTeams and generates matches', async () => {
    const { result } = renderHook(() => useChampionshipWizardFinalSubmit(knockoutWizard as never))

    await act(async () => result.current.handleSubmit())

    expect(mutateAsyncUpdate).not.toHaveBeenCalled()
    expect(mutateAsyncCreateBracket).toHaveBeenCalledWith({
      data: {
        phaseId: 'phase-1',
        name: 'Championnat U13',
        bracketTeams: [
          { teamId: 't1', round: 1, seed: 1 },
          { teamId: 't2', round: 1, seed: 2 },
        ],
      },
    })
    expect(mutateAsyncGenerateBracketMatches).toHaveBeenCalledWith({ id: 'bracket-1' })
    expect(navigate).toHaveBeenCalledWith('/app/admin/championships')
  })

  it('sets submitError and does not navigate when a mutation rejects', async () => {
    mutateAsyncCreateGroup.mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useChampionshipWizardFinalSubmit(groupWizard as never))

    await act(async () => result.current.handleSubmit())

    await waitFor(() => expect(result.current.submitError).toBe(true))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('does nothing when championshipId or phaseId is missing', async () => {
    const wizard = { ...groupWizard, championshipId: null }
    const { result } = renderHook(() => useChampionshipWizardFinalSubmit(wizard as never))

    await act(async () => result.current.handleSubmit())

    expect(mutateAsyncUpdate).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
