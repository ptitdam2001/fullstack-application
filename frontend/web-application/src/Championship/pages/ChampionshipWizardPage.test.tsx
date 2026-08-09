import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Season } from '@Season/domain/Season'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'
import { ChampionshipWizardPagePage } from './ChampionshipWizardPage.page'

const seasons: Season[] = [
  { id: 's1', label: '2025-2026', startDate: null, endDate: null, createdAt: '', updatedAt: '' },
]
const categories: AgeCategory[] = [{ id: 'c1', label: 'U13', genre: 'FEMALE' as const, createdAt: '', updatedAt: '' }]

vi.mock('@Season/application/useSeasonList', () => ({
  useSeasonList: () => ({
    query: { data: seasons },
    countQuery: { data: seasons.length },
    pagination: { page: 0, rowsPerPage: 20 },
    changePage: vi.fn(),
    totalPages: 1,
  }),
}))
vi.mock('@AgeCategory/application/useAgeCategoryList', () => ({
  useAgeCategoryList: () => ({
    query: { data: categories },
    countQuery: { data: categories.length },
    pagination: { page: 0, rowsPerPage: 20 },
    changePage: vi.fn(),
    totalPages: 1,
  }),
}))
vi.mock('@Teams/application/useTeamOptions', () => ({
  useTeamOptions: () => [],
}))
vi.mock('../infrastructure/useChampionshipApi', () => ({
  useCreateChampionship: vi.fn(),
}))
vi.mock('../infrastructure/usePhaseApi', () => ({
  useCreatePhase: vi.fn(),
}))

import { useCreateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreatePhase } from '../infrastructure/usePhaseApi'
const mockedUseCreateChampionship = vi.mocked(useCreateChampionship)
const mockedUseCreatePhase = vi.mocked(useCreatePhase)
const mutate = vi.fn()
const mutatePhase = vi.fn()

const advanceToPhaseStep = (page: ChampionshipWizardPagePage) => {
  page.selectSeason(/2025-2026/).clickNext()
  page.selectCategory(/U13/).clickNext()
  page.typeName('Championnat U13').clickNext()
  return page
}

describe('ChampionshipWizardPage', () => {
  beforeEach(() => {
    mutate.mockReset()
    mutatePhase.mockReset()
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: false, isError: false } as never)
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: false, isError: false } as never)
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'champ-1' }))
  })

  it('renders the page title', () => {
    const page = new ChampionshipWizardPagePage().render()
    expect(page.heading('championshipWizard.title')).toBeInTheDocument()
  })

  it('renders the summary panel', () => {
    new ChampionshipWizardPagePage().render()
    expect(screen.getByText('championshipWizard.summary.title')).toBeInTheDocument()
  })

  it('disables "previous" on the first step', () => {
    const page = new ChampionshipWizardPagePage().render()
    expect(page.previousButton()).toBeDisabled()
  })

  it('renders the season step by default and disables "next" until a season is selected', () => {
    const page = new ChampionshipWizardPagePage().render()
    expect(page.heading('championshipWizard.step.season')).toBeInTheDocument()
    expect(page.nextButton()).toBeDisabled()

    page.selectSeason(/2025-2026/)
    expect(page.nextButton()).not.toBeDisabled()

    page.clickNext()
    expect(page.heading('championshipWizard.step.category')).toBeInTheDocument()
  })

  it('advances season → category → name, then creates the championship on leaving the name step', () => {
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'champ-1' }))
    const page = new ChampionshipWizardPagePage().render()

    page.selectSeason(/2025-2026/).clickNext()
    page.selectCategory(/U13/).clickNext()
    page.typeName('Championnat U13').clickNext()

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
    expect(page.heading('championshipWizard.step.phase')).toBeInTheDocument()
  })

  it('does not re-create the championship when navigating back past the name step and forward again', () => {
    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'champ-1' }))
    const page = new ChampionshipWizardPagePage().render()

    page.selectSeason(/2025-2026/).clickNext()
    page.selectCategory(/U13/).clickNext()
    page.typeName('Championnat U13').clickNext()
    expect(mutate).toHaveBeenCalledTimes(1)

    page.clickPrevious()
    page.clickNext()
    expect(mutate).toHaveBeenCalledTimes(1)
  })

  it('shows an error message when the creation mutation fails', () => {
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: false, isError: true } as never)
    const page = new ChampionshipWizardPagePage().render()

    page.selectSeason(/2025-2026/).clickNext()
    page.selectCategory(/U13/).clickNext()
    page.typeName('Championnat U13')

    expect(page.errorMessage()).toBeInTheDocument()
  })

  it('disables "next" on the name step while the creation mutation is pending', () => {
    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: true, isError: false } as never)
    const page = new ChampionshipWizardPagePage().render()

    page.selectSeason(/2025-2026/).clickNext()
    page.selectCategory(/U13/).clickNext()
    page.typeName('Championnat U13')

    expect(page.nextButton()).toBeDisabled()
  })

  it('creates the phase with the championship id and default order on leaving the phase step', () => {
    mutatePhase.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'phase-1' }))
    const page = advanceToPhaseStep(new ChampionshipWizardPagePage().render())

    page.selectPhase(/championshipWizard\.phaseType\.KNOCKOUT/).clickNext()

    expect(mutatePhase).toHaveBeenCalledWith(
      { data: { championshipId: 'champ-1', type: 'KNOCKOUT', order: 1 } },
      expect.anything()
    )
    expect(page.heading('championshipWizard.step.teamsKnockout')).toBeInTheDocument()
  })

  it('shows an error message when the phase creation mutation fails', () => {
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: false, isError: true } as never)
    const page = advanceToPhaseStep(new ChampionshipWizardPagePage().render())

    page.selectPhase(/championshipWizard\.phaseType\.GROUP/)

    expect(page.phaseErrorMessage()).toBeInTheDocument()
  })

  it('disables "next" on the phase step while the phase creation mutation is pending', () => {
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: true, isError: false } as never)
    const page = advanceToPhaseStep(new ChampionshipWizardPagePage().render())

    page.selectPhase(/championshipWizard\.phaseType\.GROUP/)

    expect(page.nextButton()).toBeDisabled()
  })
})
