import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TeamCardGrid } from './TeamCardGrid'
import type { Area, Team } from '../../domain/Team'
import { describe, expect, it } from 'vitest'

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
})
