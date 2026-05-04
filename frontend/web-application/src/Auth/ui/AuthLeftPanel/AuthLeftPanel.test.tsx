import { render, screen } from '@testing-library/react'
import { AuthLeftPanel } from './AuthLeftPanel'

describe('AuthLeftPanel', () => {
  it('renders brand name', () => {
    render(<AuthLeftPanel />)
    expect(screen.getByText('Handball')).toBeInTheDocument()
  })

  it('renders default subtext', () => {
    render(<AuthLeftPanel />)
    expect(screen.getByText(/Live stats, team management/i)).toBeInTheDocument()
  })

  it('renders custom subtext', () => {
    render(<AuthLeftPanel subtext="Custom description" />)
    expect(screen.getByText('Custom description')).toBeInTheDocument()
  })

  it('renders custom headline', () => {
    render(<AuthLeftPanel headline="Custom headline" />)
    expect(screen.getByText('Custom headline')).toBeInTheDocument()
  })
})
