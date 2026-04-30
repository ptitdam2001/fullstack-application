import { render } from '@testing-library/react'
import { TeamCard } from './TeamCard'
import type { Team } from '../domain/Team'
import { describe, expect, it } from 'vitest'

const team: Team = { id: '1', name: 'Les Rouges', color: '#ff0000', areas: [] }

describe('TeamCard', () => {
  it('renders team name', () => {
    const { getByText } = render(<TeamCard team={team} />)
    expect(getByText('Les Rouges')).toBeInTheDocument()
  })

  it('renders with null color without crashing', () => {
    const { getByText } = render(<TeamCard team={{ ...team, color: null }} />)
    expect(getByText('Les Rouges')).toBeInTheDocument()
  })
})
