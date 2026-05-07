import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { List } from './List'

const items = [
  { id: '1', name: 'Aardvark' },
  { id: '2', name: 'Cat' },
  { id: '3', name: 'Dog' },
]

const renderList = () =>
  render(
    <List.Root aria-label="test" items={items} className="h-64">
      {(item) => <List.Item id={item.id}>{item.name}</List.Item>}
    </List.Root>
  )

// ─── List.Root ────────────────────────────────────────────────────────────────

describe('List.Root', () => {
  it('sets data-slot="list"', () => {
    const { container } = renderList()
    expect(container.querySelector('[data-slot="list"]')).toHaveAttribute('data-slot', 'list')
  })

  it('forwards className', () => {
    const { container } = render(
      <List.Root aria-label="test" items={items} className="h-64 custom-class">
        {(item) => <List.Item id={item.id}>{item.name}</List.Item>}
      </List.Root>
    )
    expect(container.querySelector('[data-slot="list"]')).toHaveClass('custom-class')
  })

  it('renders as a listbox', () => {
    const { getByRole } = renderList()
    expect(getByRole('listbox')).toBeInTheDocument()
  })

  it('applies default border with variant="default"', () => {
    const { container } = renderList()
    expect(container.querySelector('[data-slot="list"]')).toHaveClass('border')
  })

  it('does not apply border with variant="ghost"', () => {
    const { container } = render(
      <List.Root aria-label="test" items={items} variant="ghost" className="h-64">
        {(item) => <List.Item id={item.id}>{item.name}</List.Item>}
      </List.Root>
    )
    expect(container.querySelector('[data-slot="list"]')).not.toHaveClass('border')
  })
})

// ─── List.Item ────────────────────────────────────────────────────────────────

describe('List.Item', () => {
  it('sets data-slot="list-item"', () => {
    const { container } = renderList()
    const item = container.querySelector('[data-slot="list-item"]')
    expect(item).toHaveAttribute('data-slot', 'list-item')
  })

  it('renders children', () => {
    const { getByText } = renderList()
    expect(getByText('Aardvark')).toBeInTheDocument()
  })

  it('forwards className on list item', () => {
    const { container } = render(
      <List.Root aria-label="test" items={[{ id: '1', name: 'Cat' }]} className="h-64">
        {(item) => (
          <List.Item id={item.id} className="custom-item">
            {item.name}
          </List.Item>
        )}
      </List.Root>
    )
    expect(container.querySelector('[data-slot="list-item"]')).toHaveClass('custom-item')
  })
})
