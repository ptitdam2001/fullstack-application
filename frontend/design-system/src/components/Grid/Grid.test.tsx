import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ListBox } from 'react-aria-components'

import { Grid } from './Grid'

const items = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
  { id: '3', name: 'Gamma' },
]

const renderGrid = () =>
  render(
    <Grid.Root aria-label="test" items={items} className="h-64" layoutOptions={{ minItemSize: { width: 100, height: 80 } }}>
      {item => <Grid.Item id={item.id}>{item.name}</Grid.Item>}
    </Grid.Root>
  )

// Grid.Item tested without Virtualizer — jsdom has no layout so GridLayout renders 0 items
const renderGridItem = () =>
  render(
    <ListBox aria-label="test">
      <Grid.Item id="1">Alpha</Grid.Item>
    </ListBox>
  )

// ─── Grid.Root ────────────────────────────────────────────────────────────────

describe('Grid.Root', () => {
  it('sets data-slot="grid"', () => {
    const { container } = renderGrid()
    expect(container.querySelector('[data-slot="grid"]')).toHaveAttribute('data-slot', 'grid')
  })

  it('forwards className', () => {
    const { container } = render(
      <Grid.Root aria-label="test" items={items} className="h-64 custom-class" layoutOptions={{ minItemSize: { width: 100, height: 80 } }}>
        {item => <Grid.Item id={item.id}>{item.name}</Grid.Item>}
      </Grid.Root>
    )
    expect(container.querySelector('[data-slot="grid"]')).toHaveClass('custom-class')
  })

  it('renders as a listbox', () => {
    const { getByRole } = renderGrid()
    expect(getByRole('listbox')).toBeInTheDocument()
  })

  it('applies default border with variant="default"', () => {
    const { container } = renderGrid()
    expect(container.querySelector('[data-slot="grid"]')).toHaveClass('border')
  })

  it('does not apply border with variant="ghost"', () => {
    const { container } = render(
      <Grid.Root aria-label="test" items={items} variant="ghost" className="h-64" layoutOptions={{ minItemSize: { width: 100, height: 80 } }}>
        {item => <Grid.Item id={item.id}>{item.name}</Grid.Item>}
      </Grid.Root>
    )
    expect(container.querySelector('[data-slot="grid"]')).not.toHaveClass('border')
  })
})

// ─── Grid.Item ────────────────────────────────────────────────────────────────

describe('Grid.Item', () => {
  it('sets data-slot="grid-item"', () => {
    const { container } = renderGridItem()
    expect(container.querySelector('[data-slot="grid-item"]')).toHaveAttribute('data-slot', 'grid-item')
  })

  it('renders children', () => {
    const { getByText } = renderGridItem()
    expect(getByText('Alpha')).toBeInTheDocument()
  })

  it('forwards className on grid item', () => {
    const { container } = render(
      <ListBox aria-label="test">
        <Grid.Item id="1" className="custom-item">Alpha</Grid.Item>
      </ListBox>
    )
    expect(container.querySelector('[data-slot="grid-item"]')).toHaveClass('custom-item')
  })

  it('applies w-full h-full sizing classes', () => {
    const { container } = renderGridItem()
    const item = container.querySelector('[data-slot="grid-item"]')
    expect(item).toHaveClass('w-full')
    expect(item).toHaveClass('h-full')
  })
})
