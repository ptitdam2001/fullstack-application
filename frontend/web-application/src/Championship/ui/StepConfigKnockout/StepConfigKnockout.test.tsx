import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Team } from '@Teams/domain/Team'
import { StepConfigKnockout } from './StepConfigKnockout'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
  { id: 't4', name: 'Vénissieux HB', color: '#2ba05a', ageCategoryId: 'c3' },
]

describe('StepConfigKnockout', () => {
  it('renders the step title and hint', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1', 't2', 't3', 't4']} />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.configKnockout' })).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.configKnockout.hint')).toBeInTheDocument()
  })

  it('shows the empty hint when fewer than 2 teams are selected', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1']} />)
    expect(screen.getByText('championshipWizard.step.configKnockout.empty')).toBeInTheDocument()
  })

  it('labels the last round as the final and the previous one as semi-final', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1', 't2', 't3', 't4']} />)
    expect(screen.getByText('championshipWizard.step.configKnockout.round.semiFinal')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.configKnockout.round.final')).toBeInTheDocument()
  })

  it('renders team names in round 1 slots', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1', 't2', 't3', 't4']} />)
    expect(screen.getByText('HB Villeurbanne')).toBeInTheDocument()
    expect(screen.getByText('Lyon HB Club')).toBeInTheDocument()
    expect(screen.getByText('Bron Handball')).toBeInTheDocument()
    expect(screen.getByText('Vénissieux HB')).toBeInTheDocument()
  })

  it('shows an unresolved slot placeholder in the final before round 1 is played', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1', 't2', 't3', 't4']} />)
    expect(screen.getAllByText('championshipWizard.step.configKnockout.tbd')).toHaveLength(2)
  })

  it('shows a bye badge and direct qualifier text for an odd team out', () => {
    render(<StepConfigKnockout teams={teams} teamIds={['t1', 't2', 't3']} />)
    expect(screen.getByText('championshipWizard.step.configKnockout.byeBadge')).toBeInTheDocument()
    expect(screen.getByText('championshipWizard.step.configKnockout.bye')).toBeInTheDocument()
  })
})
