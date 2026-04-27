import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('sets data-slot="label"', () => {
    const { container } = render(<Label />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'label')
  })

  it('forwards className', () => {
    const { container } = render(<Label className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Label>Email</Label>)
    expect(getByText('Email')).toBeInTheDocument()
  })

  it('forwards htmlFor via for attribute', () => {
    const { container } = render(<Label htmlFor="email-input">Email</Label>)
    expect(container.firstChild).toHaveAttribute('for', 'email-input')
  })
})
