import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TeamCardGrid } from './TeamCardGrid'
import type { Area, Team } from '../../domain/Team'
import { afterEach, describe, expect, it, vi } from 'vitest'

const teams: Team[] = [
  { id: '1', name: 'Les Rouges', color: '#ff0000', areas: [] },
  {
    id: '2',
    name: 'Les Bleus',
    color: '#0000ff',
    areas: [{ name: 'Stade', city: 'Paris', longitude: 0, latitude: 0, address: '1 left' } as Area],
  },
]

describe('TeamCardGrid', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the grid container', () => {
    const { container } = render(
      <MemoryRouter>
        <TeamCardGrid teams={teams} />
      </MemoryRouter>
    )
    expect(container.querySelector('[data-slot="grid"]')).toBeInTheDocument()
  })

  it('renders a listbox', () => {
    render(
      <MemoryRouter>
        <TeamCardGrid teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('renders empty grid without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <TeamCardGrid teams={[]} />
      </MemoryRouter>
    )
    expect(container.querySelector('[data-slot="grid"]')).toBeInTheDocument()
  })

  it('names the listbox and the buttons of each card through i18n keys', () => {
    // GridLayout renders no item at size 0: give the scroll view the size of a screen
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1024)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(768)
    render(
      <MemoryRouter>
        <TeamCardGrid teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getByRole('listbox', { name: 'teams.title' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'teamCard.view' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'teamCard.players' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'common.edit' })).toHaveLength(2)
  })
})
