import { render, screen } from '@testing-library/react'
import { TeamCreatePage } from './TeamCreatePage'

export class TeamCreatePagePage {
  render() {
    render(<TeamCreatePage />)
    return this
  }

  dialog() {
    return screen.getByRole('dialog', { name: 'teams.createTeam' })
  }

  teamForm() {
    return screen.getByTestId('team-form')
  }
}
