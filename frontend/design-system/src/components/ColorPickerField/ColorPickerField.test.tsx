import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ColorPickerField } from './ColorPickerField'

describe('ColorPickerField', () => {
  it('sets data-slot="color-picker-field" on root element', () => {
    const { container } = render(<ColorPickerField />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'color-picker-field')
  })

  it('forwards className to root element', () => {
    const { container } = render(<ColorPickerField className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders label when provided', () => {
    const { getByText } = render(<ColorPickerField label="Team color" />)
    expect(getByText('Team color')).toBeInTheDocument()
  })

  it('does not render label when omitted', () => {
    const { container } = render(<ColorPickerField />)
    expect(container.querySelector('[data-slot="label"]')).not.toBeInTheDocument()
  })

  it('renders the trigger button', () => {
    const { getByRole } = render(<ColorPickerField label="Team color" />)
    expect(getByRole('button', { name: 'Team color' })).toBeInTheDocument()
  })

  it('shows the error message when provided', () => {
    const { getByText } = render(<ColorPickerField label="Team color" errorMessage="Color is required" />)
    expect(getByText('Color is required')).toBeInTheDocument()
  })

  it('does not show an error message when omitted', () => {
    const { queryByText } = render(<ColorPickerField label="Team color" />)
    expect(queryByText('Color is required')).not.toBeInTheDocument()
  })

  it('disables the trigger button via isDisabled', () => {
    const { getByRole } = render(<ColorPickerField label="Team color" isDisabled />)
    expect(getByRole('button', { name: 'Team color' })).toBeDisabled()
  })

  it('disables the trigger button via disabled alias', () => {
    const { getByRole } = render(<ColorPickerField label="Team color" disabled />)
    expect(getByRole('button', { name: 'Team color' })).toBeDisabled()
  })
})
