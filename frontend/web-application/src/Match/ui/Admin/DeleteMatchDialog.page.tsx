import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MatchStatus } from '../../domain/Match'
import type { Match } from '../../domain/Match'
import { DeleteMatchDialog } from './DeleteMatchDialog'

type Props = {
  match: Match
  open: boolean
  isPending: boolean
}

const defaultMatch: Match = {
  id: 'match-1',
  area: { id: 'area-1', name: 'Salle A', address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeTeam: { id: 'team-1', name: 'Lions', color: '#ff0000' },
  awayTeam: { id: 'team-2', name: 'Tigers', color: '#0000ff' },
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
}

export class DeleteMatchDialogPage {
  onOpenChange = vi.fn()
  onConfirm = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { match: defaultMatch, open: true, isPending: false, ...props }
  }

  render() {
    render(<DeleteMatchDialog {...this.props} onOpenChange={this.onOpenChange} onConfirm={this.onConfirm} />)
    return this
  }

  title() {
    return screen.getByText('adminMatches.deleteDialog.title')
  }

  description() {
    return screen.getByText('adminMatches.deleteDialog.description')
  }

  cancelButton() {
    return screen.getByText('adminMatches.deleteDialog.cancel').closest('button')!
  }

  confirmButton() {
    return screen.getByText('adminMatches.deleteDialog.confirm').closest('button')!
  }

  clickCancel() {
    fireEvent.click(this.cancelButton())
    return this
  }

  clickConfirm() {
    fireEvent.click(this.confirmButton())
    return this
  }
}
