import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { type TeamWithAgeCategoryLabel } from '../../domain/Team'
import { AdminTeamTable } from './AdminTeamTable'

const teams: TeamWithAgeCategoryLabel[] = [
  { id: '1', name: 'Les Rouges', color: '#e53e3e', areas: [], ageCategoryLabel: 'U18' },
  { id: '2', name: 'Les Bleus', color: '#3182ce', areas: [], ageCategoryLabel: 'U15' },
  { id: '3', name: 'Les Verts', color: '#38a169', areas: [] },
]

describe('AdminTeamTable', () => {
  it('renders table headers', () => {
    render(<AdminTeamTable teams={teams} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('adminTeams.table.color')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.table.name')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.table.ageCategory')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.table.venue')).toBeInTheDocument()
    expect(screen.getByText('adminTeams.table.actions')).toBeInTheDocument()
  })

  it('renders a row for each team', () => {
    render(<AdminTeamTable teams={teams} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Les Rouges')).toBeInTheDocument()
    expect(screen.getByText('Les Bleus')).toBeInTheDocument()
    expect(screen.getByText('Les Verts')).toBeInTheDocument()
  })

  it('renders empty state when teams list is empty', () => {
    render(<AdminTeamTable teams={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('adminTeams.table.empty')).toBeInTheDocument()
  })

  it('forwards onEdit to rows', () => {
    const onEdit = vi.fn()
    render(<AdminTeamTable teams={teams} onEdit={onEdit} onDelete={vi.fn()} />)

    const editButtons = screen.getAllByLabelText('adminTeams.action.edit')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('forwards onDelete to rows', () => {
    const onDelete = vi.fn()
    render(<AdminTeamTable teams={teams} onEdit={vi.fn()} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByLabelText('adminTeams.action.delete')
    fireEvent.click(deleteButtons[1])
    expect(onDelete).toHaveBeenCalledWith(teams[1])
  })
})
