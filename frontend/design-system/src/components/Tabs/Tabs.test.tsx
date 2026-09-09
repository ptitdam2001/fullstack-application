import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import type { Key } from 'react-aria-components'
import { Tabs } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanels } from './TabPanels'
import { TabPanel } from './TabPanel'

const TabsComposed = ({
  defaultSelectedKey = 'tab1',
  onSelectionChange,
}: {
  defaultSelectedKey?: string
  onSelectionChange?: (key: Key) => void
}) => (
  <Tabs defaultSelectedKey={defaultSelectedKey} onSelectionChange={onSelectionChange}>
    <TabList aria-label="Test tabs">
      <Tab id="tab1">Tab 1</Tab>
      <Tab id="tab2">Tab 2</Tab>
    </TabList>
    <TabPanels>
      <TabPanel id="tab1">Content 1</TabPanel>
      <TabPanel id="tab2">Content 2</TabPanel>
    </TabPanels>
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
      <Tabs defaultSelectedKey="a" className="custom">
        <TabList aria-label="Test tabs">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="a">A content</TabPanel>
        </TabPanels>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tabs"]')).toHaveClass('custom')
  })
})

// ─── TabList ──────────────────────────────────────────────────────────────────

describe('TabList', () => {
  it('sets data-slot="tab-list"', () => {
    const { container } = render(<TabsComposed />)
    expect(container.querySelector('[data-slot="tab-list"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Tabs defaultSelectedKey="a">
        <TabList aria-label="Test tabs" className="custom">
          <Tab id="a">A</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="a">Content</TabPanel>
        </TabPanels>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tab-list"]')).toHaveClass('custom')
  })
})

// ─── Tab ──────────────────────────────────────────────────────────────────────

describe('Tab', () => {
  it('sets data-slot="tab"', () => {
    const { container } = render(<TabsComposed />)
    const tabs = container.querySelectorAll('[data-slot="tab"]')
    expect(tabs.length).toBe(2)
  })

  it('renders tab labels', () => {
    const { getByText } = render(<TabsComposed />)
    expect(getByText('Tab 1')).toBeInTheDocument()
    expect(getByText('Tab 2')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Tabs defaultSelectedKey="a">
        <TabList aria-label="Test tabs">
          <Tab id="a" className="custom">
            A
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="a">Content</TabPanel>
        </TabPanels>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tab"]')).toHaveClass('custom')
  })

  it('renders a SelectionIndicator for the selected tab only', () => {
    const { container } = render(<TabsComposed />)
    expect(container.querySelectorAll('[data-slot="tab-indicator"]').length).toBe(1)
  })
})

// ─── TabPanels / TabPanel ────────────────────────────────────────────────────

describe('TabPanels', () => {
  it('sets data-slot="tab-panels"', () => {
    const { container } = render(<TabsComposed />)
    expect(container.querySelector('[data-slot="tab-panels"]')).toBeInTheDocument()
  })
})

describe('TabPanel', () => {
  it('sets data-slot="tab-panel"', () => {
    const { container } = render(<TabsComposed />)
    const panels = container.querySelectorAll('[data-slot="tab-panel"]')
    expect(panels.length).toBeGreaterThan(0)
  })

  it('shows default selected tab content', () => {
    const { getByText } = render(<TabsComposed defaultSelectedKey="tab1" />)
    expect(getByText('Content 1')).toBeInTheDocument()
  })

  it('switches content when tab is clicked', () => {
    const { getByText } = render(<TabsComposed defaultSelectedKey="tab1" />)
    fireEvent.click(getByText('Tab 2'))
    expect(getByText('Content 2')).toBeInTheDocument()
  })

  it('calls onSelectionChange when tab changes', () => {
    const handler = vi.fn()
    const { getByText } = render(<TabsComposed onSelectionChange={handler} />)
    fireEvent.click(getByText('Tab 2'))
    expect(handler).toHaveBeenCalledWith('tab2')
  })
})
