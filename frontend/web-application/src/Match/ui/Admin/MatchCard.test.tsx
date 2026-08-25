import { describe, expect, it } from 'vitest'
import { MatchStatus } from '../../domain/Match'
import { MatchCardPage } from './MatchCard.page'

describe('MatchCard', () => {
  it('renders the championship and stage name', () => {
    const page = new MatchCardPage().render()
    expect(page.championshipName()).toBeInTheDocument()
    expect(page.stageName()).toBeInTheDocument()
  })

  it('renders both team names', () => {
    const page = new MatchCardPage().render()
    expect(page.teamName('Les Aigles')).toBeInTheDocument()
    expect(page.teamName('Les Loups')).toBeInTheDocument()
  })

  it('renders the TBD fallback when a team is not set yet', () => {
    const page = new MatchCardPage({ homeTeam: null }).render()
    expect(page.teamTbd()).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    const page = new MatchCardPage().render()
    expect(page.statusBadge('adminMatches.tabs.scheduled')).toBeInTheDocument()
  })

  it('renders a placeholder score when the match is scheduled', () => {
    const page = new MatchCardPage().render()
    expect(page.scorePlaceholder()).toBeInTheDocument()
  })

  it('renders the actual score when the match is played', () => {
    const page = new MatchCardPage({ status: MatchStatus.PLAYED, homeGoals: 4, awayGoals: 2 }).render()
    expect(page.score()).toBeInTheDocument()
  })

  it('renders the "enter score" button when the match is scheduled', () => {
    const page = new MatchCardPage().render()
    expect(page.enterScoreButton()).toBeInTheDocument()
  })

  it('does not render the "enter score" button when the match is played', () => {
    const page = new MatchCardPage({ status: MatchStatus.PLAYED, homeGoals: 1, awayGoals: 0 }).render()
    expect(page.enterScoreButton()).not.toBeInTheDocument()
  })

  it('calls onScoreClick with the match when the "enter score" button is clicked', () => {
    const page = new MatchCardPage().render().clickEnterScoreButton()
    expect(page.onScoreClick).toHaveBeenCalled()
  })

  it('renders the menu button', () => {
    const page = new MatchCardPage().render()
    expect(page.menuButton()).toBeInTheDocument()
  })
})
