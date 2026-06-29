import { render, screen, fireEvent } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { type Area, type TeamWithAgeCategoryLabel } from '../../domain/Team'
import { AdminTeamTableRow } from './AdminTeamTableRow'

const wrapper = ({ children }: { children: ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
)

const primaryArea: Area = {
  id: 'area-1',
  name: 'Municipal Stadium',
  address: '1 Stadium Street',
  city: 'Lyon',
  longitude: 4.83,
  latitude: 45.74,
}

const team: TeamWithAgeCategoryLabel = {
  id: '1',
  name: 'Les Rouges',
  color: '#e53e3e',
  areas: [primaryArea],
  ageCategoryLabel: 'U18',
}

describe('AdminTeamTableRow', () => {
  it('renders the team name', () => {
    render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
  })

  it('renders the color swatch when color is defined', () => {
    const { container } = render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    const swatch = container.querySelector('[style*="background-color"]')
    expect(swatch).toBeInTheDocument()
  })

  it('renders — when color is null', () => {
    render(<AdminTeamTableRow team={{ ...team, color: null }} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('—')
  })

  it('renders the age category badge', () => {
    render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('U18')).toBeInTheDocument()
  })

  it('renders — when ageCategory is absent', () => {
    render(<AdminTeamTableRow team={{ ...team, ageCategoryLabel: undefined }} onEdit={vi.fn()} onDelete={vi.fn()} />, {
      wrapper,
    })
    const cells = screen.getAllByRole('cell')
    expect(cells[2]).toHaveTextContent('—')
  })

  it('renders the primary venue name', () => {
    render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByText('Municipal Stadium')).toBeInTheDocument()
  })

  it('renders — when areas is empty', () => {
    render(<AdminTeamTableRow team={{ ...team, areas: [] }} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    const cells = screen.getAllByRole('cell')
    expect(cells[3]).toHaveTextContent('—')
  })

  it('renders edit and delete action buttons', () => {
    render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={vi.fn()} />, { wrapper })
    expect(screen.getByLabelText('adminTeams.action.edit')).toBeInTheDocument()
    expect(screen.getByLabelText('adminTeams.action.delete')).toBeInTheDocument()
  })

  it('calls onEdit with team id when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<AdminTeamTableRow team={team} onEdit={onEdit} onDelete={vi.fn()} />, { wrapper })

    fireEvent.click(screen.getByLabelText('adminTeams.action.edit'))
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('calls onDelete with team when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<AdminTeamTableRow team={team} onEdit={vi.fn()} onDelete={onDelete} />, { wrapper })

    fireEvent.click(screen.getByLabelText('adminTeams.action.delete'))
    expect(onDelete).toHaveBeenCalledWith(team)
  })
})
