import { render, screen } from '@testing-library/react'
import { TeamSelect } from './TeamSelect'

const teams = [
  { id: 't1', name: 'Les Rouges', color: '#e53e3e', areas: [] },
  { id: 't2', name: 'Les Bleus', color: '#3182ce', areas: [] },
]

describe('TeamSelect', () => {
  it('renders trigger button', () => {
    render(<TeamSelect teams={teams} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<TeamSelect teams={teams} label="Équipe" />)
    expect(screen.getByText('Équipe')).toBeInTheDocument()
  })

  it('renders without crashing when teams is empty', () => {
    render(<TeamSelect teams={[]} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('forwards isDisabled', () => {
    render(<TeamSelect teams={teams} isDisabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders select data-slot', () => {
    const { container } = render(<TeamSelect teams={teams} />)
    expect(container.querySelector('[data-slot="select"]')).toBeInTheDocument()
  })
})
