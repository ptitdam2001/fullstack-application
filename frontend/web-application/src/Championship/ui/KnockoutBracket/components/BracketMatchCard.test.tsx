import { describe, expect, it } from 'vitest'
import { BracketMatchCardPage } from './BracketMatchCard.page'
import { MatchStatus } from '../../../domain/Match'

describe('BracketMatchCard', () => {
  it('renders both team names', () => {
    const page = new BracketMatchCardPage().render()
    expect(page.teamName('HB Villeurbanne')).toBeInTheDocument()
    expect(page.teamName('Lyon HB Club')).toBeInTheDocument()
  })

  it('renders scores for a played match', () => {
    const page = new BracketMatchCardPage({ status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 }).render()
    expect(page.score(3)).toHaveLength(1)
    expect(page.score(1)).toHaveLength(1)
  })

  it('renders no score for a scheduled match', () => {
    const page = new BracketMatchCardPage({
      status: MatchStatus.SCHEDULED,
      homeGoals: undefined,
      awayGoals: undefined,
    }).render()
    expect(page.score(0)).toHaveLength(0)
  })

  it('falls back to an em dash when a team is not yet determined', () => {
    const page = new BracketMatchCardPage({ homeTeam: null, homeTeamId: null }).render()
    expect(page.teamName('—')).toBeInTheDocument()
  })
})
