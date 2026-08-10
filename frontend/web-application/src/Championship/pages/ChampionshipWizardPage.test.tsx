import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Season } from '@Season/domain/Season'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'
import type { Team } from '@Teams/domain/Team'
import { ChampionshipWizardPagePage } from './ChampionshipWizardPage.page'

const seasons: Season[] = [
  { id: 's1', label: '2025-2026', startDate: null, endDate: null, createdAt: '', updatedAt: '' },
]
const categories: AgeCategory[] = [{ id: 'c1', label: 'U13', genre: 'FEMALE' as const, createdAt: '', updatedAt: '' }]
const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c1' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c1' },
]

const navigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))
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
  useTeamOptions: () => teams,
}))
vi.mock('../infrastructure/useChampionshipApi', () => ({
  useCreateChampionship: vi.fn(),
  useUpdateChampionship: vi.fn(),
}))
vi.mock('../infrastructure/usePhaseApi', () => ({
  useCreatePhase: vi.fn(),
}))
vi.mock('../infrastructure/useGroupApi', () => ({
  useCreateGroup: vi.fn(),
  useGenerateGroupMatches: vi.fn(),
}))
vi.mock('../infrastructure/useBracketApi', () => ({
  useCreateBracket: vi.fn(),
  useGenerateBracketMatches: vi.fn(),
}))

import { useCreateChampionship, useUpdateChampionship } from '../infrastructure/useChampionshipApi'
import { useCreatePhase } from '../infrastructure/usePhaseApi'
import { useCreateGroup, useGenerateGroupMatches } from '../infrastructure/useGroupApi'
import { useCreateBracket, useGenerateBracketMatches } from '../infrastructure/useBracketApi'

const mockedUseCreateChampionship = vi.mocked(useCreateChampionship)
const mockedUseCreatePhase = vi.mocked(useCreatePhase)
const mockedUseUpdateChampionship = vi.mocked(useUpdateChampionship)
const mockedUseCreateGroup = vi.mocked(useCreateGroup)
const mockedUseGenerateGroupMatches = vi.mocked(useGenerateGroupMatches)
const mockedUseCreateBracket = vi.mocked(useCreateBracket)
const mockedUseGenerateBracketMatches = vi.mocked(useGenerateBracketMatches)

const mutate = vi.fn()
const mutatePhase = vi.fn()
const mutateAsyncUpdate = vi.fn()
const mutateAsyncCreateGroup = vi.fn()
const mutateAsyncGenerateGroupMatches = vi.fn()
const mutateAsyncCreateBracket = vi.fn()
const mutateAsyncGenerateBracketMatches = vi.fn()

const advanceToPhaseStep = (page: ChampionshipWizardPagePage) => {
  page.selectSeason(/2025-2026/).clickNext()
  page.selectCategory(/U13/).clickNext()
  page.typeName('Championnat U13').clickNext()
  return page
}

const advanceToConfigGroupStep = (page: ChampionshipWizardPagePage) => {
  advanceToPhaseStep(page)
  page.selectPhase(/championshipWizard\.phaseType\.GROUP/).clickNext()
  page.assignFirstAvailableTeamToGroup(/Poule A/)
  page.assignFirstAvailableTeamToGroup(/Poule A/)
  page.clickNext()
  return page
}

const advanceToConfigKnockoutStep = (page: ChampionshipWizardPagePage) => {
  advanceToPhaseStep(page)
  page.selectPhase(/championshipWizard\.phaseType\.KNOCKOUT/).clickNext()
  page.addFirstAvailableKnockoutTeam()
  page.addFirstAvailableKnockoutTeam()
  page.clickNext()
  return page
}

describe('ChampionshipWizardPage', () => {
  beforeEach(() => {
    navigate.mockReset()
    mutate.mockReset()
    mutatePhase.mockReset()
    mutateAsyncUpdate.mockReset()
    mutateAsyncCreateGroup.mockReset()
    mutateAsyncGenerateGroupMatches.mockReset()
    mutateAsyncCreateBracket.mockReset()
    mutateAsyncGenerateBracketMatches.mockReset()

    mockedUseCreateChampionship.mockReturnValue({ mutate, isPending: false, isError: false } as never)
    mockedUseCreatePhase.mockReturnValue({ mutate: mutatePhase, isPending: false, isError: false } as never)
    mockedUseUpdateChampionship.mockReturnValue({ mutateAsync: mutateAsyncUpdate } as never)
    mockedUseCreateGroup.mockReturnValue({ mutateAsync: mutateAsyncCreateGroup } as never)
    mockedUseGenerateGroupMatches.mockReturnValue({ mutateAsync: mutateAsyncGenerateGroupMatches } as never)
    mockedUseCreateBracket.mockReturnValue({ mutateAsync: mutateAsyncCreateBracket } as never)
    mockedUseGenerateBracketMatches.mockReturnValue({ mutateAsync: mutateAsyncGenerateBracketMatches } as never)

    mutate.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'champ-1' }))
    mutatePhase.mockImplementation((_vars, { onSuccess }) => onSuccess({ id: 'phase-1' }))
    mutateAsyncUpdate.mockResolvedValue({ id: 'champ-1' })
    mutateAsyncCreateGroup.mockResolvedValue({ id: 'group-1' })
    mutateAsyncGenerateGroupMatches.mockResolvedValue([])
    mutateAsyncCreateBracket.mockResolvedValue({ id: 'bracket-1' })
    mutateAsyncGenerateBracketMatches.mockResolvedValue([])
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

  it('shows the "create championship" button on the last step instead of "next"', () => {
    const page = advanceToConfigGroupStep(new ChampionshipWizardPagePage().render())
    expect(page.heading('championshipWizard.step.configGroup')).toBeInTheDocument()
    expect(screen.queryByText('championshipWizard.action.next')).not.toBeInTheDocument()
    expect(page.createButton()).toBeInTheDocument()
  })

  it('submits a GROUP championship: updates points, creates each group and generates its matches, then navigates', async () => {
    const page = advanceToConfigGroupStep(new ChampionshipWizardPagePage().render())

    page.clickCreate()

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/app/admin/championships'))
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
      data: { phaseId: 'phase-1', name: 'Poule A', matchMode: 'SINGLE', teamIds: ['t1', 't2'] },
    })
    expect(mutateAsyncGenerateGroupMatches).toHaveBeenCalledWith({ id: 'group-1' })
  })

  it('submits a KNOCKOUT championship: creates the bracket with seeded bracketTeams and generates matches', async () => {
    const page = advanceToConfigKnockoutStep(new ChampionshipWizardPagePage().render())

    page.clickCreate()

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/app/admin/championships'))
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
  })

  it('shows an error and does not navigate when the submission fails', async () => {
    mutateAsyncCreateGroup.mockRejectedValue(new Error('boom'))
    const page = advanceToConfigGroupStep(new ChampionshipWizardPagePage().render())

    page.clickCreate()

    await waitFor(() => expect(page.submitErrorMessage()).toBeInTheDocument())
    expect(navigate).not.toHaveBeenCalled()
  })

  it('disables the create button while the submission is in flight', () => {
    mutateAsyncUpdate.mockReturnValue(new Promise(() => {}))
    const page = advanceToConfigGroupStep(new ChampionshipWizardPagePage().render())

    page.clickCreate()

    expect(page.createButton()).toBeDisabled()
  })
})
