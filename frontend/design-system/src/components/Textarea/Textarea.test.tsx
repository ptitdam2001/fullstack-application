import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('sets data-slot="textarea"', () => {
    const { container } = render(<Textarea />)
    expect(container.querySelector('[data-slot="textarea"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Textarea className="custom" />)
    expect(container.querySelector('[data-slot="textarea"]')).toHaveClass('custom')
  })

  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter notes..." />)
    expect(screen.getByPlaceholderText('Enter notes...')).toBeInTheDocument()
  })

  it('is disabled when disabled', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts typed input', () => {
    render(<Textarea />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    expect(textarea).toHaveValue('Hello world')
  })

  it('renders as textarea element', () => {
    const { container } = render(<Textarea />)
    expect(container.querySelector('textarea')).toBeInTheDocument()
  })
})
