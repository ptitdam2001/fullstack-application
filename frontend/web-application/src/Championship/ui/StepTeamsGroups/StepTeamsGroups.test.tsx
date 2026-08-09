import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Team } from '@Teams/domain/Team'
import { MatchMode } from '../../domain/Group'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'
import { StepTeamsGroups } from './StepTeamsGroups'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
]

const groups: ChampionshipWizardGroup[] = [
  { id: 'g1', name: 'Poule A', teamIds: ['t1'], matchMode: MatchMode.SINGLE, generated: false },
  { id: 'g2', name: 'Poule B', teamIds: [], matchMode: MatchMode.SINGLE, generated: false },
]

const noop = {
  onAddGroup: vi.fn(),
  onRemoveGroup: vi.fn(),
  onRenameGroup: vi.fn(),
  onAssignTeam: vi.fn(),
}

describe('StepTeamsGroups', () => {
  it('renders the step title and hint', () => {
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.teamsGroups' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.teamsGroups.hint')).toBeInTheDocument()
  })

  it('renders only unassigned teams in the available column', () => {
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} />)
    expect(screen.getByText('Lyon HB Club')).toBeInTheDocument()
    expect(screen.getAllByText('HB Villeurbanne')).toHaveLength(1)
  })

  it('renders each group with its name and assigned teams', () => {
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} />)
    expect(screen.getByDisplayValue('Poule A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Poule B')).toBeInTheDocument()
    expect(screen.getAllByText('HB Villeurbanne')).toHaveLength(1)
  })

  it('shows a warning when a group has fewer than 2 teams', () => {
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} />)
    expect(screen.getAllByText(/championshipWizard\.step\.teamsGroups\.teamCountWarn/)).toHaveLength(2)
  })

  it('calls onAddGroup when clicking the add-group button', () => {
    const onAddGroup = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onAddGroup={onAddGroup} />)
    fireEvent.click(screen.getByRole('button', { name: 'championshipWizard.step.teamsGroups.addGroup' }))
    expect(onAddGroup).toHaveBeenCalled()
  })

  it('disables remove when there is only one group, enables and calls onRemoveGroup otherwise', () => {
    const onRemoveGroup = vi.fn()
    const { rerender } = render(
      <StepTeamsGroups teams={teams} groups={[groups[0]]} {...noop} onRemoveGroup={onRemoveGroup} />
    )
    expect(screen.getByLabelText('championshipWizard.step.teamsGroups.removeGroup')).toBeDisabled()

    rerender(<StepTeamsGroups teams={teams} groups={groups} {...noop} onRemoveGroup={onRemoveGroup} />)
    const removeButtons = screen.getAllByLabelText('championshipWizard.step.teamsGroups.removeGroup')
    fireEvent.click(removeButtons[0])
    expect(onRemoveGroup).toHaveBeenCalledWith('g1')
  })

  it('calls onRenameGroup when editing a group name', () => {
    const onRenameGroup = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onRenameGroup={onRenameGroup} />)
    fireEvent.change(screen.getByDisplayValue('Poule A'), { target: { value: 'Poule Alpha' } })
    expect(onRenameGroup).toHaveBeenCalledWith('g1', 'Poule Alpha')
  })

  it('assigns an available team to a group via the assign menu', () => {
    const onAssignTeam = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onAssignTeam={onAssignTeam} />)
    fireEvent.click(screen.getByLabelText('championshipWizard.step.teamsGroups.assignTo'))
    fireEvent.click(screen.getByText('Poule B'))
    expect(onAssignTeam).toHaveBeenCalledWith('t2', 'g2')
  })

  it('unassigns a team from its group when clicking the unassign button', () => {
    const onAssignTeam = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onAssignTeam={onAssignTeam} />)
    fireEvent.click(screen.getByLabelText('championshipWizard.step.teamsGroups.unassign'))
    expect(onAssignTeam).toHaveBeenCalledWith('t1', null)
  })

  it('assigns a team dropped from the available column onto a group', () => {
    const onAssignTeam = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onAssignTeam={onAssignTeam} />)
    const item = screen.getByText('Lyon HB Club').closest('[draggable]') as HTMLElement
    fireEvent.dragStart(item)
    const groupBody = screen.getByTestId('group-body-g2')
    fireEvent.dragOver(groupBody)
    fireEvent.drop(groupBody)
    expect(onAssignTeam).toHaveBeenCalledWith('t2', 'g2')
  })

  it('unassigns a team dropped back onto the available column', () => {
    const onAssignTeam = vi.fn()
    render(<StepTeamsGroups teams={teams} groups={groups} {...noop} onAssignTeam={onAssignTeam} />)
    const item = screen.getByText('HB Villeurbanne').closest('[draggable]') as HTMLElement
    fireEvent.dragStart(item)
    const availableBody = screen.getByTestId('available-body')
    fireEvent.dragOver(availableBody)
    fireEvent.drop(availableBody)
    expect(onAssignTeam).toHaveBeenCalledWith('t1', null)
  })
})
