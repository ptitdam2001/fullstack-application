import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TeamCardList } from './TeamCardList'
import type { Team } from '../../domain/Team'

const teams: Team[] = [
  { id: '1', name: 'Les Rouges', color: '#ff0000', areas: [] },
  {
    id: '2',
    name: 'Les Bleus',
    color: '#0000ff',
    areas: [{ name: 'Stade A', city: 'Lyon', address: null, longitude: 0, latitude: 0 }],
  },
]

describe('TeamCardList', () => {
  it('renders all team names', () => {
    render(
      <MemoryRouter>
        <TeamCardList teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
    expect(screen.getByText('Les Bleus')).toBeInTheDocument()
  })

  it('renders city for teams with areas', () => {
    render(
      <MemoryRouter>
        <TeamCardList teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getByText('Lyon')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(
      <MemoryRouter>
        <TeamCardList teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})
