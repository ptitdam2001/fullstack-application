import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MatchFilters } from './MatchFilters'
import type { MatchListFilters } from '../../application/useMatchList'

type Props = {
  filters: MatchListFilters
  resultCount: number
}

export class MatchFiltersPage {
  onChange = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { filters: {}, resultCount: 0, ...props }
  }

  render() {
    render(<MatchFilters {...this.props} onChange={this.onChange} />)
    return this
  }

  championshipSelect() {
    return screen.getByRole('button', { name: /adminMatches\.filters\.championship$/ })
  }

  ageCategorySelect() {
    return screen.getByRole('button', { name: /adminMatches\.filters\.ageCategory$/ })
  }

  resultCount() {
    return screen.getByText('adminMatches.filters.count')
  }

  allTab() {
    return screen.getByText('adminMatches.tabs.all')
  }

  scheduledTab() {
    return screen.getByText('adminMatches.tabs.scheduled')
  }

  playedTab() {
    return screen.getByText('adminMatches.tabs.played')
  }

  forfeitedTab() {
    return screen.getByText('adminMatches.tabs.forfeited')
  }

  resetButton() {
    return screen.queryByText('adminMatches.filters.reset')
  }

  clickPlayedTab() {
    fireEvent.click(this.playedTab())
    return this
  }

  clickAllTab() {
    fireEvent.click(this.allTab())
    return this
  }

  clickReset() {
    fireEvent.click(this.resetButton()!)
    return this
  }
}
