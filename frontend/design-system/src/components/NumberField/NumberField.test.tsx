import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NumberField } from './NumberField'

describe('NumberField', () => {
  it('sets data-slot="number-field"', () => {
    const { container } = render(<NumberField label="Score" />)
    expect(container.querySelector('[data-slot="number-field"]')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<NumberField label="Score" />)
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('renders increment and decrement buttons', () => {
    render(<NumberField label="Score" />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('forwards className', () => {
    const { container } = render(<NumberField label="Score" className="custom" />)
    expect(container.querySelector('[data-slot="number-field"]')).toHaveClass('custom')
  })
})
