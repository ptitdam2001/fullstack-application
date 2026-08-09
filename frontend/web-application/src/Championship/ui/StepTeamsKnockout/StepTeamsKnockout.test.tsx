import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Team } from '@Teams/domain/Team'
import { StepTeamsKnockout } from './StepTeamsKnockout'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
]

describe('StepTeamsKnockout', () => {
  it('renders the step title and hint', () => {
    render(<StepTeamsKnockout teams={teams} teamIds={[]} onToggleTeam={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.teamsKnockout' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.teamsKnockout.hint')).toBeInTheDocument()
  })

  it('splits teams between the available and selected columns', () => {
    render(<StepTeamsKnockout teams={teams} teamIds={['t1']} onToggleTeam={vi.fn()} />)
    const selectedColumn = screen.getByTestId('knockout-selected-body')
    const availableColumn = screen.getByTestId('knockout-available-body')
    expect(selectedColumn).toHaveTextContent('HB Villeurbanne')
    expect(availableColumn).toHaveTextContent('Lyon HB Club')
    expect(availableColumn).toHaveTextContent('Bron Handball')
    expect(availableColumn).not.toHaveTextContent('HB Villeurbanne')
  })

  it('shows the selected count and a warning below 2 teams', () => {
    render(<StepTeamsKnockout teams={teams} teamIds={['t1']} onToggleTeam={vi.fn()} />)
    expect(screen.getByText(/championshipWizard\.step\.teamsKnockout\.countWarn/)).toBeInTheDocument()
  })

  it('shows the selected count without a warning at 2 teams or more', () => {
    render(<StepTeamsKnockout teams={teams} teamIds={['t1', 't2']} onToggleTeam={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.teamsKnockout.count')).toBeInTheDocument()
  })

  it('renders empty state hints', () => {
    render(<StepTeamsKnockout teams={teams} teamIds={[]} onToggleTeam={vi.fn()} />)
    expect(screen.getByText('championshipWizard.step.teamsKnockout.selectedEmpty')).toBeInTheDocument()
  })

  it('calls onToggleTeam when clicking the add button on an available team', () => {
    const onToggleTeam = vi.fn()
    render(<StepTeamsKnockout teams={teams} teamIds={[]} onToggleTeam={onToggleTeam} />)
    fireEvent.click(screen.getAllByLabelText('championshipWizard.step.teamsKnockout.add')[0])
    expect(onToggleTeam).toHaveBeenCalledWith('t1')
  })

  it('calls onToggleTeam when clicking the remove button on a selected team', () => {
    const onToggleTeam = vi.fn()
    render(<StepTeamsKnockout teams={teams} teamIds={['t1']} onToggleTeam={onToggleTeam} />)
    fireEvent.click(screen.getByLabelText('championshipWizard.step.teamsKnockout.remove'))
    expect(onToggleTeam).toHaveBeenCalledWith('t1')
  })

  it('selects an available team dropped onto the selected column', () => {
    const onToggleTeam = vi.fn()
    render(<StepTeamsKnockout teams={teams} teamIds={[]} onToggleTeam={onToggleTeam} />)
    const item = screen.getByText('Lyon HB Club').closest('[draggable]') as HTMLElement
    fireEvent.dragStart(item)
    const selectedBody = screen.getByTestId('knockout-selected-body')
    fireEvent.dragOver(selectedBody)
    fireEvent.drop(selectedBody)
    expect(onToggleTeam).toHaveBeenCalledWith('t2')
  })

  it('unselects a selected team dropped back onto the available column', () => {
    const onToggleTeam = vi.fn()
    render(<StepTeamsKnockout teams={teams} teamIds={['t1']} onToggleTeam={onToggleTeam} />)
    const item = screen.getByText('HB Villeurbanne').closest('[draggable]') as HTMLElement
    fireEvent.dragStart(item)
    const availableBody = screen.getByTestId('knockout-available-body')
    fireEvent.dragOver(availableBody)
    fireEvent.drop(availableBody)
    expect(onToggleTeam).toHaveBeenCalledWith('t1')
  })
})
