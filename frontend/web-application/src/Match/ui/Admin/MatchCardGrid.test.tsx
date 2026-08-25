import { describe, expect, it } from 'vitest'
import { MatchCardGridPage } from './MatchCardGrid.page'

describe('MatchCardGrid', () => {
  it('renders one card per match', () => {
    const page = new MatchCardGridPage().render()
    expect(page.championshipNames()).toHaveLength(2)
  })

  it('does not render the empty state when there are matches', () => {
    const page = new MatchCardGridPage().render()
    expect(page.emptyState()).not.toBeInTheDocument()
  })

  it('renders the empty state when there are no matches', () => {
    const page = new MatchCardGridPage({ matches: [] }).render()
    expect(page.emptyState()).toBeInTheDocument()
  })
})
