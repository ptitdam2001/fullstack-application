import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('sets data-slot="progress"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress"]')).toBeInTheDocument()
  })

  it('has progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Progress value={30} label="Chargement" />)
    expect(screen.getByText('Chargement')).toBeInTheDocument()
  })

  it('shows value text when showValue is true', () => {
    render(<Progress value={75} minValue={0} maxValue={100} showValue />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Progress value={50} className="custom" />)
    expect(container.querySelector('[data-slot="progress"]')).toHaveClass('custom')
  })

  it('has correct aria-valuenow', () => {
    render(<Progress value={42} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })
})
