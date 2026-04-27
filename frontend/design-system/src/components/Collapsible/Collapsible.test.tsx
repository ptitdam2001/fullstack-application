import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Collapsible } from './Collapsible'
import { CollapsibleTrigger } from './CollapsibleTrigger'
import { CollapsibleContent } from './CollapsibleContent'

const CollapsibleComposed = ({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (v: boolean) => void
}) => (
  <Collapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
)

// ─── Collapsible ──────────────────────────────────────────────────────────────

describe('Collapsible', () => {
  it('sets data-slot="collapsible"', () => {
    const { container } = render(<Collapsible />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'collapsible')
  })

  it('sets data-state="closed" by default', () => {
    const { container } = render(<Collapsible />)
    expect(container.firstChild).toHaveAttribute('data-state', 'closed')
  })

  it('sets data-state="open" when defaultOpen=true', () => {
    const { container } = render(<Collapsible defaultOpen />)
    expect(container.firstChild).toHaveAttribute('data-state', 'open')
  })

  it('forwards className', () => {
    const { container } = render(<Collapsible className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── CollapsibleTrigger ───────────────────────────────────────────────────────

describe('CollapsibleTrigger', () => {
  it('sets data-slot="collapsible-trigger"', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </Collapsible>
    )
    expect(container.querySelector('[data-slot="collapsible-trigger"]')).toBeInTheDocument()
  })

  it('has aria-expanded="false" when closed', () => {
    const { getByRole } = render(<CollapsibleComposed />)
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('has aria-expanded="true" when open', () => {
    const { getByRole } = render(<CollapsibleComposed defaultOpen />)
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles open state on click', () => {
    const { getByRole, getByText, queryByText } = render(<CollapsibleComposed />)
    expect(queryByText('Content')).not.toBeInTheDocument()
    fireEvent.click(getByRole('button'))
    expect(getByText('Content')).toBeInTheDocument()
  })

  it('calls onOpenChange when toggled', () => {
    const handler = vi.fn()
    const { getByRole } = render(<CollapsibleComposed onOpenChange={handler} />)
    fireEvent.click(getByRole('button'))
    expect(handler).toHaveBeenCalledWith(true)
  })
})

// ─── CollapsibleContent ───────────────────────────────────────────────────────

describe('CollapsibleContent', () => {
  it('is hidden when collapsible is closed', () => {
    const { queryByText } = render(<CollapsibleComposed />)
    expect(queryByText('Content')).not.toBeInTheDocument()
  })

  it('is visible when collapsible is open', () => {
    const { getByText } = render(<CollapsibleComposed defaultOpen />)
    expect(getByText('Content')).toBeInTheDocument()
  })

  it('sets data-slot="collapsible-content"', () => {
    const { container } = render(<CollapsibleComposed defaultOpen />)
    expect(container.querySelector('[data-slot="collapsible-content"]')).toBeInTheDocument()
  })

  it('sets data-state="open" when visible', () => {
    const { container } = render(<CollapsibleComposed defaultOpen />)
    expect(container.querySelector('[data-slot="collapsible-content"]')).toHaveAttribute('data-state', 'open')
  })
})

// ─── Controlled mode ─────────────────────────────────────────────────────────

describe('Collapsible (controlled)', () => {
  it('respects controlled open=true', () => {
    const { getByText } = render(<CollapsibleComposed open={true} />)
    expect(getByText('Content')).toBeInTheDocument()
  })

  it('respects controlled open=false', () => {
    const { queryByText } = render(<CollapsibleComposed open={false} />)
    expect(queryByText('Content')).not.toBeInTheDocument()
  })
})
