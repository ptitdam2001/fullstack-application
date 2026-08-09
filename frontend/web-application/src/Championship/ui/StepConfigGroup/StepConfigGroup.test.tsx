import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Team } from '@Teams/domain/Team'
import { MatchMode } from '../../domain/Group'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'
import { StepConfigGroup } from './StepConfigGroup'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
]

const groups: ChampionshipWizardGroup[] = [
  { id: 'g1', name: 'Poule A', teamIds: ['t1', 't2'], matchMode: MatchMode.SINGLE, generated: false },
  { id: 'g2', name: 'Poule B', teamIds: ['t1'], matchMode: MatchMode.SINGLE, generated: false },
]

const noop = {
  onSetMatchMode: vi.fn(),
  onGenerate: vi.fn(),
  onStepPoints: vi.fn(),
  onMaxRankChange: vi.fn(),
}
const points = { win: 3, draw: 2, loss: 1, forfeit: 0 }

describe('StepConfigGroup', () => {
  it('renders the step title and hint', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.configGroup' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.configGroup.hint')).toBeInTheDocument()
  })

  it('renders each group name', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Poule B')).toBeInTheDocument()
  })

  it('calls onSetMatchMode when switching to home-and-away', () => {
    const onSetMatchMode = vi.fn()
    render(
      <StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} onSetMatchMode={onSetMatchMode} />
    )
    fireEvent.click(screen.getAllByText('championshipWizard.step.configGroup.matchMode.homeAndAway')[0])
    expect(onSetMatchMode).toHaveBeenCalledWith('g1', MatchMode.HOME_AND_AWAY)
  })

  it('disables the generate button when a group has fewer than 2 teams', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    const generateButtons = screen.getAllByText('championshipWizard.step.configGroup.generate')
    expect(generateButtons[0].closest('button')).not.toBeDisabled()
    expect(generateButtons[1].closest('button')).toBeDisabled()
  })

  it('calls onGenerate when clicking the generate button', () => {
    const onGenerate = vi.fn()
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} onGenerate={onGenerate} />)
    fireEvent.click(screen.getAllByText('championshipWizard.step.configGroup.generate')[0])
    expect(onGenerate).toHaveBeenCalledWith('g1')
  })

  it('shows the not-generated empty hint when a group has enough teams but was not generated', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByText('championshipWizard.step.configGroup.previewEmptyNotGenerated')).toBeInTheDocument()
  })

  it('shows the missing-teams empty hint when a group has fewer than 2 teams', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByText('championshipWizard.step.configGroup.previewEmptyNoTeams')).toBeInTheDocument()
  })

  it('renders the generated match preview with team names', () => {
    const generatedGroups: ChampionshipWizardGroup[] = [
      { id: 'g1', name: 'Poule A', teamIds: ['t1', 't2'], matchMode: MatchMode.SINGLE, generated: true },
    ]
    render(<StepConfigGroup teams={teams} groups={generatedGroups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByText('HB Villeurbanne')).toBeInTheDocument()
    expect(screen.getByText('Lyon HB Club')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.configGroup.previewCount')).toBeInTheDocument()
  })

  it('calls onStepPoints when clicking the win stepper buttons', () => {
    const onStepPoints = vi.fn()
    render(
      <StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} onStepPoints={onStepPoints} />
    )
    fireEvent.click(screen.getAllByLabelText('championshipWizard.step.configGroup.stepper.increment')[0])
    expect(onStepPoints).toHaveBeenCalledWith('win', 1)
    fireEvent.click(screen.getAllByLabelText('championshipWizard.step.configGroup.stepper.decrement')[0])
    expect(onStepPoints).toHaveBeenCalledWith('win', -1)
  })

  it('displays the current point values', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={5} {...noop} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getAllByText('2')).toHaveLength(1)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onMaxRankChange when clicking the qualification stepper', () => {
    const onMaxRankChange = vi.fn()
    render(
      <StepConfigGroup
        teams={teams}
        groups={groups}
        points={points}
        maxRank={2}
        {...noop}
        onMaxRankChange={onMaxRankChange}
      />
    )
    fireEvent.click(screen.getByLabelText('championshipWizard.step.configGroup.qualification.stepper.increment'))
    expect(onMaxRankChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByLabelText('championshipWizard.step.configGroup.qualification.stepper.decrement'))
    expect(onMaxRankChange).toHaveBeenCalledWith(1)
  })

  it('never decrements the qualification rank below 1', () => {
    const onMaxRankChange = vi.fn()
    render(
      <StepConfigGroup
        teams={teams}
        groups={groups}
        points={points}
        maxRank={1}
        {...noop}
        onMaxRankChange={onMaxRankChange}
      />
    )
    fireEvent.click(screen.getByLabelText('championshipWizard.step.configGroup.qualification.stepper.decrement'))
    expect(onMaxRankChange).toHaveBeenCalledWith(1)
  })

  it('shows the singular qualification explanation when maxRank is 1', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={1} {...noop} />)
    expect(screen.getByText('championshipWizard.step.configGroup.qualification.explanationSingle')).toBeInTheDocument()
  })

  it('shows the plural qualification explanation when maxRank is greater than 1', () => {
    render(<StepConfigGroup teams={teams} groups={groups} points={points} maxRank={2} {...noop} />)
    expect(screen.getByText('championshipWizard.step.configGroup.qualification.explanationMulti')).toBeInTheDocument()
  })
})
