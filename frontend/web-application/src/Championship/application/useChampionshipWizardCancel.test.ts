import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('../infrastructure/useChampionshipApi', () => ({ useRemoveChampionship: vi.fn() }))

import { useRemoveChampionship } from '../infrastructure/useChampionshipApi'
import { useChampionshipWizardCancel } from './useChampionshipWizardCancel'

const mockedUseRemoveChampionship = vi.mocked(useRemoveChampionship)
const mutate = vi.fn()

const wizardWithChampionship = { championshipId: 'champ-1' }
const wizardWithoutChampionship = { championshipId: null }

describe('useChampionshipWizardCancel', () => {
  beforeEach(() => {
    navigate.mockReset()
    mutate.mockReset()
    mockedUseRemoveChampionship.mockReturnValue({ mutate, isPending: false, isError: false } as never)
  })

  it('navigates directly without opening the dialog when no championship was created yet', () => {
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithoutChampionship as never))

    act(() => result.current.handleCancelPress())

    expect(result.current.isDialogOpen).toBe(false)
    expect(navigate).toHaveBeenCalledWith('/app/admin/championships')
    expect(mutate).not.toHaveBeenCalled()
  })

  it('opens the confirmation dialog when a championship already exists', () => {
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithChampionship as never))

    act(() => result.current.handleCancelPress())

    expect(result.current.isDialogOpen).toBe(true)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('keeps the championship and navigates away on "keep for later"', () => {
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithChampionship as never))

    act(() => result.current.handleCancelPress())
    act(() => result.current.handleKeepForLater())

    expect(result.current.isDialogOpen).toBe(false)
    expect(mutate).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/app/admin/championships')
  })

  it('deletes the championship and navigates away on success', () => {
    mutate.mockImplementation((_vars, { onSuccess }: { onSuccess: () => void }) => onSuccess())
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithChampionship as never))

    act(() => result.current.handleDeletePermanently())

    expect(mutate).toHaveBeenCalledWith({ id: 'champ-1' }, expect.any(Object))
    expect(navigate).toHaveBeenCalledWith('/app/admin/championships')
  })

  it('does not call the mutation when there is no championship to delete', () => {
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithoutChampionship as never))

    act(() => result.current.handleDeletePermanently())

    expect(mutate).not.toHaveBeenCalled()
  })

  it('exposes the mutation pending/error state', () => {
    mockedUseRemoveChampionship.mockReturnValue({ mutate, isPending: true, isError: true } as never)
    const { result } = renderHook(() => useChampionshipWizardCancel(wizardWithChampionship as never))

    expect(result.current.isDeleting).toBe(true)
    expect(result.current.deleteError).toBe(true)
  })
})
