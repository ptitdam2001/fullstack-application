import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Select } from './Select'
import { SelectItem } from './SelectItem'

function BasicSelect() {
  return (
    <Select label="Country">
      <SelectItem id="fr">France</SelectItem>
      <SelectItem id="uk">UK</SelectItem>
    </Select>
  )
}

describe('Select', () => {
  it('sets data-slot="select"', () => {
    const { container } = render(<BasicSelect />)
    expect(container.querySelector('[data-slot="select"]')).toBeInTheDocument()
  })

  it('renders trigger button', () => {
    const { getByRole } = render(<BasicSelect />)
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('renders label', () => {
    const { getByText } = render(<BasicSelect />)
    expect(getByText('Country')).toBeInTheDocument()
  })
})

describe('SelectItem', () => {
  it('data-slot="select" present with items', () => {
    const { container } = render(
      <Select>
        <SelectItem id="a">Option A</SelectItem>
      </Select>
    )
    expect(container.querySelector('[data-slot="select"]')).toBeInTheDocument()
  })
})
