import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

describe('Checkbox', () => {
  it('sets data-slot="checkbox"', () => {
    const { container } = render(<Checkbox>Accept</Checkbox>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'checkbox')
  })

  it('forwards className', () => {
    const { container } = render(<Checkbox className="extra">Accept</Checkbox>)
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders children', () => {
    const { getByText } = render(<Checkbox>Accept terms</Checkbox>)
    expect(getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders as a checkbox input', () => {
    const { getByRole } = render(<Checkbox>Accept</Checkbox>)
    expect(getByRole('checkbox')).toBeInTheDocument()
  })

  it('is disabled when isDisabled is set', () => {
    const { getByRole } = render(<Checkbox isDisabled>Accept</Checkbox>)
    expect(getByRole('checkbox')).toBeDisabled()
  })

  it('toggles on click', () => {
    const { getByRole } = render(<Checkbox>Accept</Checkbox>)
    const checkbox = getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})

describe('CheckboxGroup', () => {
  it('sets data-slot="checkbox-group"', () => {
    const { container } = render(
      <CheckboxGroup>
        <Checkbox value="a">A</Checkbox>
      </CheckboxGroup>
    )
    expect(container.firstChild).toHaveAttribute('data-slot', 'checkbox-group')
  })

  it('renders label', () => {
    const { getByText } = render(
      <CheckboxGroup label="Options">
        <Checkbox value="a">A</Checkbox>
      </CheckboxGroup>
    )
    expect(getByText('Options')).toBeInTheDocument()
  })

  it('renders children', () => {
    const { getByText } = render(
      <CheckboxGroup>
        <Checkbox value="a">Option A</Checkbox>
        <Checkbox value="b">Option B</Checkbox>
      </CheckboxGroup>
    )
    expect(getByText('Option A')).toBeInTheDocument()
    expect(getByText('Option B')).toBeInTheDocument()
  })
})
