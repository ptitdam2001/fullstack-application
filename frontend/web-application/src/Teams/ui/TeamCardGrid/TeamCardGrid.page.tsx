import { fireEvent, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import { TeamCardGrid } from './TeamCardGrid'
import type { Team } from '../../domain/Team'
import { currentPath, renderAtRoute } from '../../../../tests/test-utils'

type CardButton = 'teamCard.view' | 'teamCard.players' | 'common.edit'

export class TeamCardGridPage {
  constructor(private readonly teams: Team[]) {}

  /**
   * Renders the grid at its route in the application: the Edit button navigates with a relative path.
   * The test file restores the size mocks after each test (`vi.restoreAllMocks()`).
   */
  render() {
    // GridLayout renders no item at size 0: give the scroll view the size of a screen
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1024)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(768)
    renderAtRoute(<TeamCardGrid teams={this.teams} />, '/app/team/list')
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
