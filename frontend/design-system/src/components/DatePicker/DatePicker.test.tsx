import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DatePicker } from './DatePicker'
import { Calendar } from './Calendar'

describe('DatePicker', () => {
  it('sets data-slot="date-picker"', () => {
    const { container } = render(<DatePicker />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'date-picker')
  })

  it('renders placeholder when no value', () => {
    const { getByText } = render(<DatePicker placeholder="Choisir une date" />)
    expect(getByText('Choisir une date')).toBeInTheDocument()
  })

  it('renders formatted date when value is set', () => {
    const date = new Date(2024, 5, 15) // 15 juin 2024
    const { getByText } = render(<DatePicker value={date} />)
    expect(getByText('15/06/2024')).toBeInTheDocument()
  })

  it('renders label', () => {
    const { getByText } = render(<DatePicker label="Date du match" />)
    expect(getByText('Date du match')).toBeInTheDocument()
  })

  it('renders trigger button', () => {
    const { getByRole } = render(<DatePicker />)
    expect(getByRole('button')).toBeInTheDocument()
  })
})

describe('Calendar', () => {
  it('sets data-slot="calendar"', () => {
    const { container } = render(<Calendar mode="single" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'calendar')
  })

  it('renders a grid', () => {
    const { getByRole } = render(<Calendar mode="single" />)
    expect(getByRole('grid')).toBeInTheDocument()
  })
})
