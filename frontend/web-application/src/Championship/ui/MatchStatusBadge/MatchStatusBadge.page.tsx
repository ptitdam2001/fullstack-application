import { render, screen } from '@testing-library/react'
import { MatchStatusBadge } from './MatchStatusBadge'
import { MatchStatus } from '../../domain/Match'

export class MatchStatusBadgePage {
  private status: MatchStatus

  constructor(status: MatchStatus = MatchStatus.SCHEDULED) {
    this.status = status
  }

  render() {
    render(<MatchStatusBadge status={this.status} />)
    return this
  }

  badge(messageId: string) {
    return screen.getByText(messageId)
  }

  badgeElement() {
    return screen.getByTestId('match-status-badge')
  }
}
