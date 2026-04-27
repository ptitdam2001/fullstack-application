import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('sets data-slot="button"', () => {
    const { container } = render(<Button />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'button')
  })

  it('renders a <button> element by default', () => {
    const { container } = render(<Button />)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
  })

  it('forwards className', () => {
    const { container } = render(<Button className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handler = vi.fn()
    const { getByRole } = render(<Button onClick={handler}>Btn</Button>)
    fireEvent.click(getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Button />)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('applies destructive variant classes', () => {
    const { container } = render(<Button variant="destructive" />)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('applies outline variant classes', () => {
    const { container } = render(<Button variant="outline" />)
    expect(container.firstChild).toHaveClass('border')
  })

  it('applies ghost variant classes', () => {
    const { container } = render(<Button variant="ghost" />)
    expect(container.firstChild).toHaveClass('hover:bg-accent')
  })

  it('applies sm size classes', () => {
    const { container } = render(<Button size="sm" />)
    expect(container.firstChild).toHaveClass('h-8')
  })

  it('applies lg size classes', () => {
    const { container } = render(<Button size="lg" />)
    expect(container.firstChild).toHaveClass('h-10')
  })

  it('applies icon size classes', () => {
    const { container } = render(<Button size="icon" />)
    expect(container.firstChild).toHaveClass('size-9')
  })

  it('renders as child element when asChild=true', () => {
    const { container } = render(
      <Button asChild>
        <a href="#">link</a>
      </Button>
    )
    expect(container.firstChild?.nodeName).toBe('A')
    expect(container.firstChild).toHaveAttribute('data-slot', 'button')
  })

  it('is disabled when disabled prop is set', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>)
    expect(getByRole('button')).toBeDisabled()
  })
})
