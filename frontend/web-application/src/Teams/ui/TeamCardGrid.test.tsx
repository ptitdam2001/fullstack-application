import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TeamCardGrid } from './TeamCardGrid'
import type { Team } from '../domain/Team'
import { describe, expect, it } from 'vitest'

const teams: Team[] = [
  { id: '1', name: 'Les Rouges', color: '#ff0000', areas: [] },
  {
    id: '2',
    name: 'Les Bleus',
    color: '#0000ff',
    areas: [{ name: 'Stade', city: 'Paris', address: null, longitude: 0, latitude: 0 }],
  },
]

describe('TeamCardGrid', () => {
  it('renders all team names', () => {
    render(
      <MemoryRouter>
        <TeamCardGrid teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
    expect(screen.getByText('Les Bleus')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    render(
      <MemoryRouter>
        <TeamCardGrid teams={teams} />
      </MemoryRouter>
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders empty list without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <TeamCardGrid teams={[]} />
      </MemoryRouter>
    )
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
})
