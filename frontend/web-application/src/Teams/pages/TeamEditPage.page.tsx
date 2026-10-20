import { render, screen } from '@testing-library/react'
import { TeamEditPage } from './TeamEditPage'

export class TeamEditPagePage {
  render() {
    render(<TeamEditPage />)
    return this
  }

  dialog() {
    return screen.getByRole('dialog', { name: 'teams.editTeam' })
  }

  teamForm() {
    return screen.getByTestId('team-form')
  }
}
