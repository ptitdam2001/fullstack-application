import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Label } from 'react-aria-components'
import { TextField } from './TextField'
import { FieldError } from './FieldError'
import { Input } from '../Input/Input'

describe('TextField', () => {
  it('sets data-slot="text-field"', () => {
    const { container } = render(<TextField><Input /></TextField>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'text-field')
  })

  it('forwards className', () => {
    const { container } = render(<TextField className="extra"><Input /></TextField>)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders label and input', () => {
    const { getByText, getByRole } = render(
      <TextField>
        <Label>Email</Label>
        <Input type="email" />
      </TextField>
    )
    expect(getByText('Email')).toBeInTheDocument()
    expect(getByRole('textbox')).toBeInTheDocument()
  })

  it('marks input as required when isRequired', () => {
    const { getByRole } = render(
      <TextField isRequired>
        <Label>Email</Label>
        <Input />
      </TextField>
    )
    expect(getByRole('textbox')).toBeRequired()
  })
})

describe('FieldError', () => {
  it('sets data-slot="field-error"', () => {
    const { container } = render(
      <TextField isInvalid>
        <Input />
        <FieldError>Invalid</FieldError>
      </TextField>
    )
    expect(container.querySelector('[data-slot="field-error"]')).toBeInTheDocument()
  })

  it('renders error message', () => {
    const { getByText } = render(
      <TextField isInvalid>
        <Input />
        <FieldError>Ce champ est requis</FieldError>
      </TextField>
    )
    expect(getByText('Ce champ est requis')).toBeInTheDocument()
  })
})
