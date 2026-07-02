import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ColorSlider } from './ColorSlider'

describe('ColorSlider', () => {
  it('sets data-slot="color-slider"', () => {
    const { container } = render(<ColorSlider defaultValue="hsl(280, 100%, 25%)" channel="hue" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'color-slider')
  })

  it('forwards className', () => {
    const { container } = render(<ColorSlider defaultValue="hsl(280, 100%, 25%)" channel="hue" className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders label when provided', () => {
    const { getByText } = render(<ColorSlider defaultValue="hsl(280, 100%, 25%)" channel="hue" label="Hue" />)
    expect(getByText('Hue')).toBeInTheDocument()
  })

  it('renders a color thumb', () => {
    const { container } = render(<ColorSlider defaultValue="hsl(280, 100%, 25%)" channel="hue" />)
    expect(container.querySelector('[data-slot="color-thumb"]')).toBeInTheDocument()
  })

  it('renders as a slider', () => {
    const { getByRole } = render(<ColorSlider defaultValue="hsl(280, 100%, 25%)" channel="hue" label="Hue" />)
    expect(getByRole('slider', { name: 'Hue' })).toBeInTheDocument()
  })
})
