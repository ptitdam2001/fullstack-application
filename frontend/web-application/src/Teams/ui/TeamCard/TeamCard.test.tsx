import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { type Area, type Team } from '../../domain/Team'
import { TeamCard } from './TeamCard'

// react-intl is globally mocked in tests/setup.ts
// FormattedMessage renders its `id` prop — assert on the key, not the translated string

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>

const primaryArea: Area = {
  _id: 'area-1',
  name: 'Municipal Stadium',
  address: '1 Stadium Street',
  city: 'Lyon',
  longitude: 4.83,
  latitude: 45.74,
}

const team: Team & { ageCategory?: string } = {
  id: '1',
  name: 'Les Rouges',
  color: '#e53e3e',
  areas: [primaryArea],
  ageCategory: 'U18',
}

describe('TeamCard', () => {
  it('renders the team name in bold', () => {
    render(<TeamCard team={team} />, { wrapper })
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
  })

  it('renders the color swatch when a color is provided', () => {
    const { container } = render(<TeamCard team={team} />, { wrapper })
    const swatch = container.querySelector('[style*="background-color"]')
    expect(swatch).toBeInTheDocument()
  })

  it('does not render the color swatch when color is absent', () => {
    const { container } = render(<TeamCard team={{ ...team, color: null }} />, { wrapper })
    const swatch = container.querySelector('[style*="background-color"]')
    expect(swatch).not.toBeInTheDocument()
  })

  it('renders the age category badge when defined', () => {
    render(<TeamCard team={team} />, { wrapper })
    expect(screen.getByText('U18')).toBeInTheDocument()
  })

  it('does not render an age category badge when ageCategory is absent', () => {
    render(<TeamCard team={{ ...team, ageCategory: undefined }} />, { wrapper })
    expect(screen.queryByText('U18')).not.toBeInTheDocument()
  })

  it('renders the primary venue via TeamCardVenue', () => {
    render(<TeamCard team={team} />, { wrapper })
    expect(screen.getByText('Municipal Stadium')).toBeInTheDocument()
  })

  it('does not render a venue when areas is empty', () => {
    render(<TeamCard team={{ ...team, areas: [] }} />, { wrapper })
    expect(screen.queryByText('Municipal Stadium')).not.toBeInTheDocument()
  })

  it('renders the View button', () => {
    render(<TeamCard team={team} />, { wrapper })
    expect(screen.getByText('teamCard.view')).toBeInTheDocument()
  })
})
