import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Menu } from 'react-aria-components'
import { DropdownMenuLabel } from './DropdownMenuLabel'
import { DropdownMenuSeparator } from './DropdownMenuSeparator'
import { DropdownMenuShortcut } from './DropdownMenuShortcut'
import { DropdownMenuGroup } from './DropdownMenuGroup'
import { DropdownMenuTrigger } from './DropdownMenuTrigger'
import { DropdownMenuItem } from './DropdownMenuItem'

// MenuItem and Section from react-aria require a collection context (Menu)
const renderInMenu = (ui: React.ReactElement) => render(<Menu aria-label="test">{ui}</Menu>)

// ─── DropdownMenuLabel ────────────────────────────────────────────────────────

describe('DropdownMenuLabel', () => {
  it('sets data-slot="dropdown-menu-label"', () => {
    const { container } = render(<DropdownMenuLabel />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dropdown-menu-label')
  })

  it('forwards className', () => {
    const { container } = render(<DropdownMenuLabel className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<DropdownMenuLabel>Actions</DropdownMenuLabel>)
    expect(getByText('Actions')).toBeInTheDocument()
  })

  it('sets data-inset when inset=true', () => {
    const { container } = render(<DropdownMenuLabel inset />)
    expect(container.firstChild).toHaveAttribute('data-inset', 'true')
  })
})

// ─── DropdownMenuSeparator ────────────────────────────────────────────────────

describe('DropdownMenuSeparator', () => {
  it('sets data-slot="dropdown-menu-separator"', () => {
    const { container } = render(<DropdownMenuSeparator />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dropdown-menu-separator')
  })

  it('forwards className', () => {
    const { container } = render(<DropdownMenuSeparator className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── DropdownMenuShortcut ─────────────────────────────────────────────────────

describe('DropdownMenuShortcut', () => {
  it('sets data-slot="dropdown-menu-shortcut"', () => {
    const { container } = render(<DropdownMenuShortcut />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dropdown-menu-shortcut')
  })

  it('renders a <span>', () => {
    const { container } = render(<DropdownMenuShortcut />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('renders shortcut text', () => {
    const { getByText } = render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>)
    expect(getByText('⌘K')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<DropdownMenuShortcut className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── DropdownMenuTrigger ──────────────────────────────────────────────────────

describe('DropdownMenuTrigger', () => {
  it('renders children', () => {
    const { getByText } = render(
      <DropdownMenuTrigger>
        <button>Open</button>
      </DropdownMenuTrigger>
    )
    expect(getByText('Open')).toBeInTheDocument()
  })
})

// ─── DropdownMenuItem ─────────────────────────────────────────────────────────

describe('DropdownMenuItem', () => {
  it('sets data-slot="dropdown-menu-item"', () => {
    const { container } = renderInMenu(<DropdownMenuItem>Item</DropdownMenuItem>)
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-item'
    )
  })

  it('forwards className', () => {
    const { container } = renderInMenu(<DropdownMenuItem className="custom">Item</DropdownMenuItem>)
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toHaveClass('custom')
  })

  it('sets data-variant="destructive"', () => {
    const { container } = renderInMenu(<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>)
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toHaveAttribute('data-variant', 'destructive')
  })

  it('sets data-inset when inset=true', () => {
    const { container } = renderInMenu(<DropdownMenuItem inset>Item</DropdownMenuItem>)
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toHaveAttribute('data-inset', 'true')
  })
})

// ─── DropdownMenuGroup ────────────────────────────────────────────────────────

describe('DropdownMenuGroup', () => {
  it('sets data-slot="dropdown-menu-group"', () => {
    const { container } = renderInMenu(<DropdownMenuGroup />)
    expect(container.querySelector('[data-slot="dropdown-menu-group"]')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-group'
    )
  })

  it('renders children', () => {
    const { getByText } = renderInMenu(
      <DropdownMenuGroup>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
      </DropdownMenuGroup>
    )
    expect(getByText('Item 1')).toBeInTheDocument()
  })
})
