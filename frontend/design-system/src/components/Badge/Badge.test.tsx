import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('sets data-slot="badge"', () => {
    const { container } = render(<Badge />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'badge')
  })

  it('renders a <span> by default', () => {
    const { container } = render(<Badge />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('forwards className', () => {
    const { container } = render(<Badge className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Badge>Active</Badge>)
    expect(getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    const { container } = render(<Badge />)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('applies destructive variant classes', () => {
    const { container } = render(<Badge variant="destructive" />)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('applies secondary variant classes', () => {
    const { container } = render(<Badge variant="secondary" />)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('applies outline variant classes', () => {
    const { container } = render(<Badge variant="outline" />)
    expect(container.firstChild).toHaveClass('text-foreground')
  })

  it('renders as child element when asChild=true', () => {
    const { container } = render(
      <Badge asChild>
        <a href="#">link</a>
      </Badge>
    )
    expect(container.firstChild?.nodeName).toBe('A')
    expect(container.firstChild).toHaveAttribute('data-slot', 'badge')
  })
})
