import { render, screen } from '@testing-library/react'
import { TeamSelect } from './TeamSelect'

const teams = [
  { id: 't1', name: 'Les Rouges', color: '#e53e3e', areas: [] },
  { id: 't2', name: 'Les Bleus', color: '#3182ce', areas: [] },
]

describe('TeamSelect', () => {
  it('renders all team options', () => {
    render(<TeamSelect teams={teams} />)
    expect(screen.getByRole('option', { name: 'Les Rouges' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Les Bleus' })).toBeInTheDocument()
  })

  it('renders placeholder option in single mode', () => {
    render(<TeamSelect teams={teams} placeholder="Select a team…" />)
    expect(screen.getByRole('option', { name: 'Select a team…' })).toBeInTheDocument()
  })

  it('does not render placeholder in multiple mode', () => {
    render(<TeamSelect teams={teams} multiple placeholder="Select a team…" />)
    expect(screen.queryByRole('option', { name: 'Select a team…' })).not.toBeInTheDocument()
  })

  it('renders as multiple select when multiple=true', () => {
    const { container } = render(<TeamSelect teams={teams} multiple />)
    expect(container.querySelector('select')).toHaveAttribute('multiple')
  })

  it('renders empty list without crashing', () => {
    const { container } = render(<TeamSelect teams={[]} />)
    expect(container.querySelector('select')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<TeamSelect teams={[]} className="custom" />)
    expect(container.querySelector('select')).toHaveClass('custom')
  })

  it('forwards aria-invalid', () => {
    const { container } = render(<TeamSelect teams={[]} aria-invalid={true} />)
    expect(container.querySelector('select')).toHaveAttribute('aria-invalid', 'true')
  })
})
