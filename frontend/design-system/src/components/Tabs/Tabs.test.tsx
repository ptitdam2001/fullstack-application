import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'
import { TabsList } from './TabsList'
import { TabsTrigger } from './TabsTrigger'
import { TabsContent } from './TabsContent'

const TabsComposed = ({
  defaultValue = 'tab1',
  onValueChange,
}: {
  defaultValue?: string
  onValueChange?: (v: string) => void
}) => (
  <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
)

// ─── Tabs ─────────────────────────────────────────────────────────────────────

describe('Tabs', () => {
  it('sets data-slot="tabs"', () => {
    const { container } = render(<TabsComposed />)
    expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Tabs defaultValue="a" className="custom">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tabs"]')).toHaveClass('custom')
  })
})

// ─── TabsList ─────────────────────────────────────────────────────────────────

describe('TabsList', () => {
  it('sets data-slot="tabs-list"', () => {
    const { container } = render(<TabsComposed />)
    expect(container.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList className="custom">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content</TabsContent>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tabs-list"]')).toHaveClass('custom')
  })
})

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

describe('TabsTrigger', () => {
  it('sets data-slot="tabs-trigger"', () => {
    const { container } = render(<TabsComposed />)
    const triggers = container.querySelectorAll('[data-slot="tabs-trigger"]')
    expect(triggers.length).toBe(2)
  })

  it('renders tab labels', () => {
    const { getByText } = render(<TabsComposed />)
    expect(getByText('Tab 1')).toBeInTheDocument()
    expect(getByText('Tab 2')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" className="custom">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content</TabsContent>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tabs-trigger"]')).toHaveClass('custom')
  })
})

// ─── TabsContent ──────────────────────────────────────────────────────────────

describe('TabsContent', () => {
  it('sets data-slot="tabs-content"', () => {
    const { container } = render(<TabsComposed />)
    const panels = container.querySelectorAll('[data-slot="tabs-content"]')
    expect(panels.length).toBeGreaterThan(0)
  })

  it('shows default selected tab content', () => {
    const { getByText } = render(<TabsComposed defaultValue="tab1" />)
    expect(getByText('Content 1')).toBeInTheDocument()
  })

  it('switches content when tab is clicked', () => {
    const { getByText } = render(<TabsComposed defaultValue="tab1" />)
    fireEvent.click(getByText('Tab 2'))
    expect(getByText('Content 2')).toBeInTheDocument()
  })

  it('calls onValueChange when tab changes', () => {
    const handler = vi.fn()
    const { getByText } = render(<TabsComposed onValueChange={handler} />)
    fireEvent.click(getByText('Tab 2'))
    expect(handler).toHaveBeenCalledWith('tab2')
  })
})
