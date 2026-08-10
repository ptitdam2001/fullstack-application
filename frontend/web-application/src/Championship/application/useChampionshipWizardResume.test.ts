import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PhaseType } from '../domain/Phase'

let championshipId: string | undefined

vi.mock('react-router', () => ({ useParams: () => ({ championshipId }) }))
vi.mock('../infrastructure/useChampionshipApi', () => ({ useGetChampionship: vi.fn() }))
vi.mock('../infrastructure/usePhaseApi', () => ({ useGetChampionshipPhases: vi.fn() }))

import { useGetChampionship } from '../infrastructure/useChampionshipApi'
import { useGetChampionshipPhases } from '../infrastructure/usePhaseApi'
import { useChampionshipWizardResume } from './useChampionshipWizardResume'

const mockedUseGetChampionship = vi.mocked(useGetChampionship)
const mockedUseGetChampionshipPhases = vi.mocked(useGetChampionshipPhases)

const championship = {
  id: 'champ-1',
  name: 'Championnat U13',
  ageCategoryId: 'c1',
  seasonId: 's1',
  pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
}

const makeWizard = (overrides: { championshipId?: string | null } = {}) => ({
  championshipId: null,
  hydrate: vi.fn(),
  ...overrides,
})

describe('useChampionshipWizardResume', () => {
  beforeEach(() => {
    championshipId = undefined
    mockedUseGetChampionship.mockReturnValue({ data: undefined } as never)
    mockedUseGetChampionshipPhases.mockReturnValue({ data: undefined } as never)
  })

  it('does nothing when there is no championshipId in the route', () => {
    const wizard = makeWizard()
    const { result } = renderHook(() => useChampionshipWizardResume(wizard as never))

    expect(result.current.isLoading).toBe(false)
    expect(wizard.hydrate).not.toHaveBeenCalled()
  })

  it('is loading while the championship/phases data has not arrived yet', () => {
    championshipId = 'champ-1'
    const wizard = makeWizard()
    const { result } = renderHook(() => useChampionshipWizardResume(wizard as never))

    expect(result.current.isLoading).toBe(true)
    expect(wizard.hydrate).not.toHaveBeenCalled()
  })

  it('hydrates at the phase step when the championship has no phase yet', () => {
    championshipId = 'champ-1'
    mockedUseGetChampionship.mockReturnValue({ data: championship } as never)
    mockedUseGetChampionshipPhases.mockReturnValue({ data: [] } as never)
    const wizard = makeWizard()

    renderHook(() => useChampionshipWizardResume(wizard as never))

    expect(wizard.hydrate).toHaveBeenCalledWith({
      seasonId: 's1',
      categoryId: 'c1',
      name: 'Championnat U13',
      championshipId: 'champ-1',
      phaseType: null,
      phaseId: null,
      maxRank: null,
      step: 3,
    })
  })

  it('hydrates at the teams step with the phase type/id/maxRank when a phase already exists', () => {
    championshipId = 'champ-1'
    mockedUseGetChampionship.mockReturnValue({ data: championship } as never)
    mockedUseGetChampionshipPhases.mockReturnValue({
      data: [
        { id: 'phase-1', championshipId: 'champ-1', type: PhaseType.GROUP, order: 1, qualification: { maxRank: 2 } },
      ],
    } as never)
    const wizard = makeWizard()

    renderHook(() => useChampionshipWizardResume(wizard as never))

    expect(wizard.hydrate).toHaveBeenCalledWith({
      seasonId: 's1',
      categoryId: 'c1',
      name: 'Championnat U13',
      championshipId: 'champ-1',
      phaseType: PhaseType.GROUP,
      phaseId: 'phase-1',
      maxRank: 2,
      step: 4,
    })
  })

  it('does not hydrate again once the wizard already has a championshipId', () => {
    championshipId = 'champ-1'
    mockedUseGetChampionship.mockReturnValue({ data: championship } as never)
    mockedUseGetChampionshipPhases.mockReturnValue({ data: [] } as never)
    const wizard = makeWizard({ championshipId: 'champ-1' })

    const { result } = renderHook(() => useChampionshipWizardResume(wizard as never))

    expect(result.current.isLoading).toBe(false)
    expect(wizard.hydrate).not.toHaveBeenCalled()
  })
})
