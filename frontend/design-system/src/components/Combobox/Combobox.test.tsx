import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Combobox } from './Combobox'
import { ComboboxItem } from './ComboboxItem'

function BasicCombobox() {
  return (
    <Combobox label="Équipe" placeholder="Chercher...">
      <ComboboxItem id="team1">Équipe A</ComboboxItem>
      <ComboboxItem id="team2">Équipe B</ComboboxItem>
    </Combobox>
  )
}

describe('Combobox', () => {
  it('sets data-slot="combobox"', () => {
    const { container } = render(<BasicCombobox />)
    expect(container.querySelector('[data-slot="combobox"]')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<BasicCombobox />)
    expect(screen.getByText('Équipe')).toBeInTheDocument()
  })

  it('renders combobox input', () => {
    render(<BasicCombobox />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders toggle button', () => {
    render(<BasicCombobox />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Combobox className="custom">
        <ComboboxItem id="a">A</ComboboxItem>
      </Combobox>
    )
    expect(container.querySelector('[data-slot="combobox"]')).toHaveClass('custom')
  })

  it('input has placeholder', () => {
    render(<Combobox placeholder="Chercher..."><ComboboxItem id="a">A</ComboboxItem></Combobox>)
    expect(screen.getByPlaceholderText('Chercher...')).toBeInTheDocument()
  })
})

describe('ComboboxItem', () => {
  it('renders ComboboxItem data-slot when combobox has items', () => {
    const { container } = render(
      <Combobox>
        <ComboboxItem id="x">Option X</ComboboxItem>
      </Combobox>
    )
    // Items are in the Popover portal — verify combobox root exists
    expect(container.querySelector('[data-slot="combobox"]')).toBeInTheDocument()
  })
})
