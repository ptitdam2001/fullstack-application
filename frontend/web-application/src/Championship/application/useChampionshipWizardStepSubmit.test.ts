import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PhaseType } from '../domain/Phase'

vi.mock('../infrastructure/useChampionshipApi', () => ({ useCreateChampionship: vi.fn() }))
vi.mock('../infrastructure/usePhaseApi', () => ({ useCreatePhase: vi.fn() }))

import { useCreateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreatePhase } from '../infrastructure/usePhaseApi'
import { useChampionshipWizardStepSubmit } from './useChampionshipWizardStepSubmit'

const mockedUseCreateChampionship = vi.mocked(useCreateChampionship)
const mockedUseCreatePhase = vi.mocked(useCreatePhase)

const mutate = vi.fn()
const mutatePhase = vi.fn()

const baseWizard = {
  step: 2,
  championshipId: null as string | null,
  categoryId: 'c1',
  seasonId: 's1',
  name: 'Championnat U13',
  phaseType: null as PhaseType | null,
  phaseId: null as string | null,
  setChampionshipId: vi.fn(),
  setPhaseId: vi.fn(),
  next: vi.fn(),
}

describe('useChampionshipWizardStepSubmit', () => {
  beforeEach(() => {
    mutate.mockReset()
    mutatePhase.mockReset()
    baseWizard.setChampionshipId.mockReset()
    baseWizard.setPhaseId.mockReset()
    baseWizard.next.mockReset()
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: false, isError: false } as never)
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: false, isError: false } as never)
  })

  it('creates the championship on step 2, then advances via setChampionshipId + next on success', () => {
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'champ-1' }))
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(baseWizard as never))

    act(() => result.current.handleNext())

    expect(mutate).toHaveBeenCalledWith(
      {
        data: {
          name: 'Championnat U13',
          ageCategoryId: 'c1',
          seasonId: 's1',
          pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
        },
      },
      expect.anything()
    )
    expect(baseWizard.setChampionshipId).toHaveBeenCalledWith('champ-1')
    expect(baseWizard.next).toHaveBeenCalled()
  })

  it('creates the phase on step 3, then advances via setPhaseId + next on success', () => {
    mutatePhase.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'phase-1' }))
    const wizard = { ...baseWizard, step: 3, championshipId: 'champ-1', phaseType: PhaseType.KNOCKOUT } as never
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(wizard))

    act(() => result.current.handleNext())

    expect(mutatePhase).toHaveBeenCalledWith(
      { data: { championshipId: 'champ-1', type: PhaseType.KNOCKOUT, order: 1 } },
      expect.anything()
    )
    expect((wizard as never as typeof baseWizard).setPhaseId).toHaveBeenCalledWith('phase-1')
    expect((wizard as never as typeof baseWizard).next).toHaveBeenCalled()
  })

  it('does not re-create the phase on step 3 when phaseId is already set (resumed draft, back then next)', () => {
    const wizard = {
      ...baseWizard,
      step: 3,
      championshipId: 'champ-1',
      phaseType: PhaseType.KNOCKOUT,
      phaseId: 'phase-1',
    } as never
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(wizard))

    act(() => result.current.handleNext())

    expect(mutatePhase).not.toHaveBeenCalled()
    expect((wizard as never as typeof baseWizard).next).toHaveBeenCalled()
  })

  it('just calls next() on any other step', () => {
    const wizard = { ...baseWizard, step: 0 } as never
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(wizard))

    act(() => result.current.handleNext())

    expect(mutate).not.toHaveBeenCalled()
    expect((wizard as never as typeof baseWizard).next).toHaveBeenCalled()
  })

  it('reports isNextPending from the championship mutation on step 2', () => {
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: true, isError: false } as never)
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(baseWizard as never))
    expect(result.current.isNextPending).toBe(true)
  })

  it('exposes createChampionshipError and createPhaseError from mutation state', () => {
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: false, isError: true } as never)
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: false, isError: true } as never)
    const { result } = renderHook(() => useChampionshipWizardStepSubmit(baseWizard as never))
    expect(result.current.createChampionshipError).toBe(true)
    expect(result.current.createPhaseError).toBe(true)
  })
})
