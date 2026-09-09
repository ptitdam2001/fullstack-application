import { describe, expect, it } from 'vitest'
import { MatchRowPage } from './MatchRow.page'
import { MatchStatus } from '../../../domain/Match'

describe('MatchRow', () => {
  it('renders both team names', () => {
    const page = new MatchRowPage().render()
    expect(page.teamName('HB Villeurbanne')).toBeInTheDocument()
    expect(page.teamName('Lyon HB Club')).toBeInTheDocument()
  })

  it('renders scores for a played match', () => {
    const page = new MatchRowPage({ status: MatchStatus.PLAYED, homeGoals: 24, awayGoals: 19 }).render()
    expect(page.scores(24)).toHaveLength(1)
    expect(page.scores(19)).toHaveLength(1)
  })

  it('renders a placeholder score for a scheduled match', () => {
    const page = new MatchRowPage({
      status: MatchStatus.SCHEDULED,
      homeGoals: undefined,
      awayGoals: undefined,
    }).render()
    expect(page.scores('-')).toHaveLength(2)
  })

  it('renders the status badge i18n key', () => {
    const page = new MatchRowPage({ status: MatchStatus.PLAYED }).render()
    expect(page.statusBadge('championshipDetail.matches.status.played')).toBeInTheDocument()
  })

  it('falls back to an em dash when a team is missing', () => {
    const page = new MatchRowPage({ homeTeam: null }).render()
    expect(page.teamName('—')).toBeInTheDocument()
  })
})
