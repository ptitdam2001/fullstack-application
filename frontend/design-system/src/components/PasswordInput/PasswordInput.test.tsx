import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from './PasswordInput'

describe('PasswordInput', () => {
  it('sets data-slot="password-input"', () => {
    const { container } = render(<PasswordInput />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'password-input')
  })

  it('renders input as type="password" by default', () => {
    const { container } = render(<PasswordInput />)
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
  })

  it('renders toggle button with default aria-label', () => {
    render(<PasswordInput />)
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('toggles to type="text" on button click', () => {
    const { container } = render(<PasswordInput />)
    const toggle = screen.getByRole('button', { name: 'Show password' })
    fireEvent.click(toggle)
    expect(container.querySelector('input')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })

  it('toggles back to type="password" on second click', () => {
    const { container } = render(<PasswordInput />)
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
  })

  it('forwards className to the input', () => {
    const { container } = render(<PasswordInput className="custom" />)
    expect(container.querySelector('input')).toHaveClass('custom')
  })

  it('accepts custom show/hide labels', () => {
    render(<PasswordInput showPasswordLabel="Afficher" hidePasswordLabel="Masquer" />)
    expect(screen.getByRole('button', { name: 'Afficher' })).toBeInTheDocument()
  })

  it('forwards input props', () => {
    render(<PasswordInput placeholder="••••••••" />)
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })
})
