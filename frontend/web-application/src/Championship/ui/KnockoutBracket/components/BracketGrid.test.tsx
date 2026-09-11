import { describe, expect, it } from 'vitest'
import { BracketGridPage, buildMatch } from './BracketGrid.page'

describe('BracketGrid', () => {
  it('renders the semi-final and final round labels', () => {
    const page = new BracketGridPage().render()
    expect(page.roundLabel('championshipDetail.knockout.round.semiFinal')).toBeInTheDocument()
    expect(page.roundLabel('championshipDetail.knockout.round.final')).toBeInTheDocument()
  })

  it('renders team names from every round', () => {
    const page = new BracketGridPage().render()
    expect(page.teamName('A')).toBeInTheDocument()
    expect(page.teamName('D')).toBeInTheDocument()
  })

  it('renders one connector path per connector', () => {
    const page = new BracketGridPage().render()
    expect(page.connectorPaths()).toHaveLength(2)
  })

  it('labels a single-round bracket as the final', () => {
    const rounds = [[buildMatch({ id: 'final', round: 1, bracketPosition: 1 })]]
    const page = new BracketGridPage(rounds, []).render()
    expect(page.roundLabel('championshipDetail.knockout.round.final')).toBeInTheDocument()
  })
})
