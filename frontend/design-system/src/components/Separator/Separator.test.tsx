import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  it('sets data-slot="separator"', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'separator')
  })

  it('forwards className', () => {
    const { container } = render(<Separator className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('defaults to horizontal orientation', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('sets vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical')
  })

  it('has role="none" when decorative (default)', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('role', 'none')
  })

  it('has role="separator" when not decorative', () => {
    const { container } = render(<Separator decorative={false} />)
    expect(container.firstChild).toHaveAttribute('role', 'separator')
  })

  it('sets aria-orientation when not decorative', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />)
    expect(container.firstChild).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('omits aria-orientation when decorative', () => {
    const { container } = render(<Separator decorative orientation="vertical" />)
    expect(container.firstChild).not.toHaveAttribute('aria-orientation')
  })
})
