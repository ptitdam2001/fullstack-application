import { describe, expect, it, vi } from 'vitest'
import { MatchStatus } from '../../domain/Match'
import { MatchFiltersPage } from './MatchFilters.page'

vi.mock('@Championship/application/useChampionshipList', () => ({
  useChampionshipList: vi.fn(() => ({
    query: {
      data: [
        { id: 'champ-1', name: 'Championnat U13' },
        { id: 'champ-2', name: 'Championnat U15' },
      ],
    },
  })),
}))

vi.mock('@AgeCategory/application/useAgeCategoryList', () => ({
  useAgeCategoryList: vi.fn(() => ({
    query: {
      data: [
        { id: 'cat-1', label: 'U13' },
        { id: 'cat-2', label: 'U15' },
      ],
    },
  })),
}))

describe('MatchFilters', () => {
  it('renders the championship and age category selects with an accessible name', () => {
    const page = new MatchFiltersPage().render()
    expect(page.championshipSelect()).toBeInTheDocument()
    expect(page.ageCategorySelect()).toBeInTheDocument()
  })

  it('renders the result count', () => {
    const page = new MatchFiltersPage({ resultCount: 12 }).render()
    expect(page.resultCount()).toBeInTheDocument()
  })

  it('renders the status tabs', () => {
    const page = new MatchFiltersPage().render()
    expect(page.allTab()).toBeInTheDocument()
    expect(page.scheduledTab()).toBeInTheDocument()
    expect(page.playedTab()).toBeInTheDocument()
    expect(page.forfeitedTab()).toBeInTheDocument()
  })

  it('calls onChange with the selected status when a tab is clicked', () => {
    const page = new MatchFiltersPage().render().clickPlayedTab()
    expect(page.onChange).toHaveBeenCalledWith({ status: MatchStatus.PLAYED })
  })

  it('calls onChange with status undefined when the "all" tab is clicked', () => {
    const page = new MatchFiltersPage({ filters: { status: MatchStatus.PLAYED } }).render().clickAllTab()
    expect(page.onChange).toHaveBeenCalledWith({ status: undefined })
  })

  it('does not render the reset button when no filter is active', () => {
    const page = new MatchFiltersPage().render()
    expect(page.resetButton()).not.toBeInTheDocument()
  })

  it('renders the reset button when a filter is active', () => {
    const page = new MatchFiltersPage({ filters: { championshipId: 'champ-1' } }).render()
    expect(page.resetButton()).toBeInTheDocument()
  })

  it('calls onChange with empty filters when reset is clicked', () => {
    const page = new MatchFiltersPage({
      filters: { championshipId: 'champ-1', status: MatchStatus.PLAYED },
    })
      .render()
      .clickReset()
    expect(page.onChange).toHaveBeenCalledWith({})
  })
})
