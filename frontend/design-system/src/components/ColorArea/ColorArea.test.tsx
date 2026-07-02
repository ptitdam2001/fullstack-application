import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ColorArea } from './ColorArea'

describe('ColorArea', () => {
  it('sets data-slot="color-area"', () => {
    const { container } = render(<ColorArea defaultValue="#7f00ff" colorSpace="hsb" xChannel="saturation" yChannel="brightness" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'color-area')
  })

  it('forwards className', () => {
    const { container } = render(
      <ColorArea
        defaultValue="#7f00ff"
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        className="custom"
      />
    )
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders a color thumb', () => {
    const { container } = render(<ColorArea defaultValue="#7f00ff" colorSpace="hsb" xChannel="saturation" yChannel="brightness" />)
    expect(container.querySelector('[data-slot="color-thumb"]')).toBeInTheDocument()
  })
})
