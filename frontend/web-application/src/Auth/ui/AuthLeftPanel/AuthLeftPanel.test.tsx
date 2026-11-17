import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthLeftPanel } from './AuthLeftPanel'

// The global react-intl mock renders the message ids
describe('AuthLeftPanel', () => {
  it('renders the brand and the default texts through i18n keys', () => {
    render(<AuthLeftPanel />)

    expect(screen.getByText('auth.brand.short')).toBeInTheDocument()
    expect(screen.getByText('auth.brand.name')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'auth.panel.headline' })).toBeInTheDocument()
    expect(screen.getByText('auth.signin')).toBeInTheDocument()
  })

  it('renders the given headline and subtext instead of the defaults', () => {
    render(<AuthLeftPanel headline="Create your team" subtext="In a few steps" />)

    expect(screen.getByRole('heading', { name: 'Create your team' })).toBeInTheDocument()
    expect(screen.getByText('In a few steps')).toBeInTheDocument()
    expect(screen.queryByText('auth.panel.headline')).not.toBeInTheDocument()
  })
})
