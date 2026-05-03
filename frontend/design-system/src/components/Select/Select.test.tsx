import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Select } from './Select'
import { SelectValue } from './SelectValue'
import { SelectContent } from './SelectContent'
import { SelectItem } from './SelectItem'
import { Button } from '../Button/Button'
import { Label } from 'react-aria-components'

function BasicSelect() {
  return (
    <Select>
      <Label>Country</Label>
      <Button>
        <SelectValue />
      </Button>
      <SelectContent>
        <SelectItem id="fr">France</SelectItem>
        <SelectItem id="uk">UK</SelectItem>
      </SelectContent>
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
  it('sets data-slot="select"', () => {
    const { container } = render(
      <Select>
        <Button><SelectValue /></Button>
        <SelectContent>
          <SelectItem id="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(container.querySelector('[data-slot="select"]')).toBeInTheDocument()
  })
})
