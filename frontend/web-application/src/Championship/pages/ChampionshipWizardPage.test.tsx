import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipWizardPage } from './ChampionshipWizardPage'

describe('ChampionshipWizardPage', () => {
  it('renders the page title', () => {
    render(<ChampionshipWizardPage />)
    expect(screen.getByText('championshipWizard.title')).toBeInTheDocument()
  })

  it('renders the heading for the current step (season, step 1)', () => {
    render(<ChampionshipWizardPage />)
    expect(screen.getByRole('heading', { name: 'championshipWizard.step.season' })).toBeInTheDocument()
  })

  it('renders the summary panel', () => {
    render(<ChampionshipWizardPage />)
    expect(screen.getByText('championshipWizard.summary.title')).toBeInTheDocument()
  })

  it('disables "previous" on the first step', () => {
    render(<ChampionshipWizardPage />)
    expect(screen.getByText('championshipWizard.action.previous').closest('button')).toBeDisabled()
  })

  it('disables "next" while the step is not valid', () => {
    render(<ChampionshipWizardPage />)
    expect(screen.getByText('championshipWizard.action.next').closest('button')).toBeDisabled()
  })
})
