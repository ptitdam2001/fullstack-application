import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('sets data-slot="input"', () => {
    const { container } = render(<Input />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'input')
  })

  it('renders an <input> element', () => {
    const { container } = render(<Input />)
    expect(container.firstChild?.nodeName).toBe('INPUT')
  })

  it('forwards className', () => {
    const { container } = render(<Input className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('forwards type prop', () => {
    const { getByRole } = render(<Input type="email" />)
    expect(getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('forwards value and onChange', () => {
    const handler = vi.fn()
    const { getByRole } = render(<Input value="hello" onChange={handler} readOnly />)
    expect(getByRole('textbox')).toHaveValue('hello')
  })

  it('forwards placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />)
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    const { container } = render(<Input disabled />)
    expect(container.firstChild).toBeDisabled()
  })

  it('accepts onChange events', () => {
    const handler = vi.fn()
    const { container } = render(<Input onChange={handler} />)
    fireEvent.change(container.firstChild as Element, { target: { value: 'test' } })
    expect(handler).toHaveBeenCalledOnce()
  })
})
