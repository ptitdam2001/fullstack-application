import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextInputField } from './TextInputField'

describe('TextInputField', () => {
  it('sets data-slot="text-input-field" on root element', () => {
    const { container } = render(<TextInputField />)
    expect(container.querySelector('[data-slot="text-input-field"]')).toBeInTheDocument()
  })

  it('forwards className to root element', () => {
    const { container } = render(<TextInputField className="custom-class" />)
    expect(container.querySelector('[data-slot="text-input-field"]')).toHaveClass('custom-class')
  })

  it('renders the input', () => {
    render(<TextInputField />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<TextInputField label="Full name" />)
    expect(screen.getByText('Full name')).toBeInTheDocument()
  })

  it('does not render label when omitted', () => {
    render(<TextInputField aria-label="Search" />)
    expect(screen.queryByText('Full name')).not.toBeInTheDocument()
  })

  it('links label to input via react-aria', () => {
    render(<TextInputField label="Email" />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
  })

  it('accepts type prop and forwards it to input', () => {
    render(<TextInputField label="Email" type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('forwards placeholder to input', () => {
    render(<TextInputField label="Name" placeholder="Enter name" />)
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })

  describe('validation', () => {
    it('shows error message when isInvalid and errorMessage provided', () => {
      render(<TextInputField label="Email" isInvalid errorMessage="Invalid email" />)
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('shows error message when only errorMessage provided (auto-derives isInvalid)', () => {
      render(<TextInputField label="Name" errorMessage="Name is required" />)
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    it('does not show error message when valid', () => {
      render(<TextInputField label="Name" />)
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    })

    it('sets aria-invalid on input when isInvalid', () => {
      render(<TextInputField label="Name" isInvalid />)
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets aria-invalid when only errorMessage provided', () => {
      render(<TextInputField label="Name" errorMessage="Required" />)
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('required', () => {
    it('renders asterisk when isRequired', () => {
      render(<TextInputField label="Name" isRequired />)
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('does not render asterisk without isRequired', () => {
      render(<TextInputField label="Name" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('sets required on input', () => {
      render(<TextInputField label="Name" isRequired />)
      expect(screen.getByRole('textbox', { name: /name/i })).toBeRequired()
    })
  })

  describe('value coercion', () => {
    it('coerces null value to empty string', () => {
      render(<TextInputField label="Name" value={null} onChange={vi.fn()} />)
      expect(screen.getByRole('textbox')).toHaveValue('')
    })

    it('coerces number value to string', () => {
      render(<TextInputField label="Score" value={42} onChange={vi.fn()} />)
      expect(screen.getByRole('textbox')).toHaveValue('42')
    })

    it('passes string value through unchanged', () => {
      render(<TextInputField label="Name" value="Alice" onChange={vi.fn()} />)
      expect(screen.getByRole('textbox')).toHaveValue('Alice')
    })
  })

  describe('disabled', () => {
    it('disables input via isDisabled', () => {
      render(<TextInputField label="Name" isDisabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('disables input via disabled alias', () => {
      render(<TextInputField label="Name" disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('onChange', () => {
    it('calls onChange with the string value', () => {
      const onChange = vi.fn()
      render(<TextInputField label="Name" onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Alice' } })
      expect(onChange).toHaveBeenCalledWith('Alice')
    })
  })
})
