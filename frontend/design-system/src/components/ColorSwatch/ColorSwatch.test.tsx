import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ColorSwatch } from './ColorSwatch'

describe('ColorSwatch', () => {
  it('sets data-slot="color-swatch"', () => {
    const { container } = render(<ColorSwatch color="#ff0000" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'color-swatch')
  })

  it('forwards className', () => {
    const { container } = render(<ColorSwatch color="#ff0000" className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders with an accessible color description', () => {
    const { getByRole } = render(<ColorSwatch color="#ff0000" />)
    expect(getByRole('img')).toBeInTheDocument()
  })

  it('accepts a custom aria-label', () => {
    const { getByRole } = render(<ColorSwatch color="#ff0000" aria-label="Background color" />)
    expect(getByRole('img', { name: /background color/i })).toBeInTheDocument()
  })
})
