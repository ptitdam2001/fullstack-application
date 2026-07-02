import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorField } from './ColorField'

describe('ColorField', () => {
  it('sets data-slot="color-field" on root element', () => {
    const { container } = render(<ColorField />)
    expect(container.querySelector('[data-slot="color-field"]')).toBeInTheDocument()
  })

  it('forwards className to root element', () => {
    const { container } = render(<ColorField className="custom-class" />)
    expect(container.querySelector('[data-slot="color-field"]')).toHaveClass('custom-class')
  })

  it('renders the input', () => {
    render(<ColorField />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<ColorField label="Hex" />)
    expect(screen.getByText('Hex')).toBeInTheDocument()
  })

  it('shows error message when provided (auto-derives isInvalid)', () => {
    render(<ColorField label="Hex" errorMessage="Invalid color" />)
    expect(screen.getByText('Invalid color')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Hex' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('accepts a default hex value', () => {
    render(<ColorField label="Hex" defaultValue="#7f00ff" />)
    expect(screen.getByRole('textbox')).toHaveValue('#7F00FF')
  })

  it('calls onChange with a Color value', () => {
    const onChange = vi.fn()
    render(<ColorField label="Hex" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '#123456' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalled()
  })
})
