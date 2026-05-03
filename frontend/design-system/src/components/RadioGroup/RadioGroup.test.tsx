import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from './RadioGroup'
import { Radio } from './Radio'

describe('RadioGroup', () => {
  it('sets data-slot="radio-group"', () => {
    const { container } = render(
      <RadioGroup>
        <Radio value="a">A</Radio>
      </RadioGroup>
    )
    expect(container.querySelector('[data-slot="radio-group"]')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <RadioGroup label="Pick one">
        <Radio value="a">A</Radio>
      </RadioGroup>
    )
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <RadioGroup>
        <Radio value="opt1">Option 1</Radio>
        <Radio value="opt2">Option 2</Radio>
      </RadioGroup>
    )
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <RadioGroup className="custom">
        <Radio value="a">A</Radio>
      </RadioGroup>
    )
    expect(container.querySelector('[data-slot="radio-group"]')).toHaveClass('custom')
  })
})

describe('Radio', () => {
  it('sets data-slot="radio"', () => {
    const { container } = render(
      <RadioGroup>
        <Radio value="x">X</Radio>
      </RadioGroup>
    )
    expect(container.querySelector('[data-slot="radio"]')).toBeInTheDocument()
  })

  it('has radio role', () => {
    render(
      <RadioGroup>
        <Radio value="y">Yes</Radio>
      </RadioGroup>
    )
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <RadioGroup>
        <Radio value="z">Choice Z</Radio>
      </RadioGroup>
    )
    expect(screen.getByText('Choice Z')).toBeInTheDocument()
  })

  it('is disabled when isDisabled', () => {
    render(
      <RadioGroup>
        <Radio value="d" isDisabled>Disabled</Radio>
      </RadioGroup>
    )
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('selects radio on click', () => {
    render(
      <RadioGroup>
        <Radio value="a">Alpha</Radio>
        <Radio value="b">Beta</Radio>
      </RadioGroup>
    )
    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])
    expect(radios[0]).toBeChecked()
    expect(radios[1]).not.toBeChecked()
  })
})
