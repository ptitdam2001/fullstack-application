import { describe, expect, it, vi } from 'vitest'
import { TeamsPagePage } from './TeamsPage.page'

vi.mock('../ui/TeamList/TeamList', () => ({
  TeamList: ({ viewMode }: { viewMode: string }) => <div data-testid="team-list" data-view-mode={viewMode} />,
}))

describe('TeamsPage', () => {
  it('names the create link and the view toggle buttons with translated labels', () => {
    const page = new TeamsPagePage().render()
    expect(page.createLink()).toHaveAttribute('href', '/create')
    expect(page.gridViewButton()).toBeInTheDocument()
    expect(page.listViewButton()).toBeInTheDocument()
  })

  it('switches the team list between the list and grid views', () => {
    const page = new TeamsPagePage().render()
    expect(page.teamList()).toHaveAttribute('data-view-mode', 'grid')

    page.showList()
    expect(page.teamList()).toHaveAttribute('data-view-mode', 'list')

    page.showGrid()
    expect(page.teamList()).toHaveAttribute('data-view-mode', 'grid')
  })
})
