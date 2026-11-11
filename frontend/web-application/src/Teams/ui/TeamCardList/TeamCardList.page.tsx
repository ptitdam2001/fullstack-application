import { fireEvent, screen, within } from '@testing-library/react'
import { TeamCardList } from './TeamCardList'
import type { Team } from '../../domain/Team'
import { currentPath, renderAtRoute } from '../../../../tests/test-utils'

type CardButton = 'teamCard.view' | 'teamCard.players' | 'common.edit'

export class TeamCardListPage {
  constructor(private readonly teams: Team[]) {}

  /** Renders the list at its route in the application: the Edit button navigates with a relative path. */
  render() {
    renderAtRoute(<TeamCardList teams={this.teams} />, '/app/team/list')
    return this
  }

  card(teamName: string) {
    return screen.getByRole('option', { name: teamName })
  }

  pressButton(teamName: string, button: CardButton) {
    fireEvent.click(within(this.card(teamName)).getByRole('button', { name: button }))
  }

  currentPath() {
    return currentPath()
  }
}
