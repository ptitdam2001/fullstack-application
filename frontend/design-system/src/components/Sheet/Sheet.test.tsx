import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SheetHeader } from './SheetHeader'
import { SheetTitle } from './SheetTitle'
import { SheetDescription } from './SheetDescription'
import { SheetFooter } from './SheetFooter'
import { SheetOverlay } from './SheetOverlay'

// ─── SheetHeader ──────────────────────────────────────────────────────────────

describe('SheetHeader', () => {
  it('sets data-slot="sheet-header"', () => {
    const { container } = render(<SheetHeader />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'sheet-header')
  })

  it('forwards className', () => {
    const { container } = render(<SheetHeader className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(
      <SheetHeader>
        <span>Title</span>
      </SheetHeader>
    )
    expect(getByText('Title')).toBeInTheDocument()
  })
})

// ─── SheetTitle ───────────────────────────────────────────────────────────────

describe('SheetTitle', () => {
  it('sets data-slot="sheet-title"', () => {
    const { container } = render(<SheetTitle />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'sheet-title')
  })

  it('forwards className', () => {
    const { container } = render(<SheetTitle className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders text', () => {
    const { getByText } = render(<SheetTitle>Edit Profile</SheetTitle>)
    expect(getByText('Edit Profile')).toBeInTheDocument()
  })
})

// ─── SheetDescription ─────────────────────────────────────────────────────────

describe('SheetDescription', () => {
  it('sets data-slot="sheet-description"', () => {
    const { container } = render(<SheetDescription />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'sheet-description')
  })

  it('renders a <p> element', () => {
    const { container } = render(<SheetDescription />)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('renders text', () => {
    const { getByText } = render(<SheetDescription>Make changes here.</SheetDescription>)
    expect(getByText('Make changes here.')).toBeInTheDocument()
  })
})

// ─── SheetFooter ──────────────────────────────────────────────────────────────

describe('SheetFooter', () => {
  it('sets data-slot="sheet-footer"', () => {
    const { container } = render(<SheetFooter />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'sheet-footer')
  })

  it('renders children', () => {
    const { getByText } = render(
      <SheetFooter>
        <button>Save</button>
      </SheetFooter>
    )
    expect(getByText('Save')).toBeInTheDocument()
  })
})

// ─── SheetOverlay ─────────────────────────────────────────────────────────────

describe('SheetOverlay', () => {
  it('sets data-slot="sheet-overlay"', () => {
    const { container } = render(<SheetOverlay />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'sheet-overlay')
  })

  it('forwards className', () => {
    const { container } = render(<SheetOverlay className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
