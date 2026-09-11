import { describe, expect, it } from 'vitest'
import { KnockoutBracketPage } from './KnockoutBracket.page'

describe('KnockoutBracket', () => {
  it('renders the title', () => {
    const page = new KnockoutBracketPage().render()
    expect(page.title()).toBeInTheDocument()
  })

  it('renders the bracket matches when a bracket exists', () => {
    const page = new KnockoutBracketPage().render()
    expect(page.teamName('A')).toBeInTheDocument()
    expect(page.emptyMessage()).not.toBeInTheDocument()
  })

  it('shows the empty message when there is no bracket yet', () => {
    const page = new KnockoutBracketPage([]).render()
    expect(page.emptyMessage()).toBeInTheDocument()
  })
})
