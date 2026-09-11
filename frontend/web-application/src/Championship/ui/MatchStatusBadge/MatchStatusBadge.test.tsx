import { describe, expect, it } from 'vitest'
import { MatchStatusBadgePage } from './MatchStatusBadge.page'
import { MatchStatus } from '../../domain/Match'

describe('MatchStatusBadge', () => {
  it('renders the scheduled status i18n key', () => {
    const page = new MatchStatusBadgePage(MatchStatus.SCHEDULED).render()
    expect(page.badge('championshipDetail.matches.status.scheduled')).toBeInTheDocument()
  })

  it('renders the played status i18n key', () => {
    const page = new MatchStatusBadgePage(MatchStatus.PLAYED).render()
    expect(page.badge('championshipDetail.matches.status.played')).toBeInTheDocument()
  })

  it('renders the forfeited status i18n key', () => {
    const page = new MatchStatusBadgePage(MatchStatus.FORFEITED).render()
    expect(page.badge('championshipDetail.matches.status.forfeited')).toBeInTheDocument()
  })

  it('renders the cancelled status i18n key', () => {
    const page = new MatchStatusBadgePage(MatchStatus.CANCELLED).render()
    expect(page.badge('championshipDetail.matches.status.cancelled')).toBeInTheDocument()
  })

  it('exposes the status via a data attribute for styling', () => {
    const page = new MatchStatusBadgePage(MatchStatus.PLAYED).render()
    expect(page.badgeElement()).toHaveAttribute('data-status', MatchStatus.PLAYED)
  })
})
