import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('sets data-slot="switch"', () => {
    const { container } = render(<Switch>Enable</Switch>)
    expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Switch className="custom">Toggle</Switch>)
    expect(container.querySelector('[data-slot="switch"]')).toHaveClass('custom')
  })

  it('renders children as label', () => {
    render(<Switch>Notifications</Switch>)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('has switch role', () => {
    render(<Switch>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Switch>Toggle</Switch>)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('is checked when defaultSelected', () => {
    render(<Switch defaultSelected>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('toggles on click', () => {
    render(<Switch>Toggle</Switch>)
    const sw = screen.getByRole('switch')
    expect(sw).not.toBeChecked()
    fireEvent.click(sw)
    expect(sw).toBeChecked()
  })

  it('is disabled when isDisabled', () => {
    render(<Switch isDisabled>Toggle</Switch>)
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
