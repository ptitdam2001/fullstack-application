import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TeamsPage } from './TeamsPage'

export class TeamsPagePage {
  render() {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    )
    return this
  }

  createLink() {
    return screen.getByRole('link', { name: 'teams.createTeam' })
  }

  gridViewButton() {
    return screen.getByRole('button', { name: 'teams.gridView' })
  }

  listViewButton() {
    return screen.getByRole('button', { name: 'teams.listView' })
  }

  teamList() {
    return screen.getByTestId('team-list')
  }

  showList() {
    fireEvent.click(this.listViewButton())
  }

  showGrid() {
    fireEvent.click(this.gridViewButton())
  }
}
