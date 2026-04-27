import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'
import { DialogOverlay } from './DialogOverlay'
import { DialogClose } from './DialogClose'
import { DialogTrigger } from './DialogTrigger'

// ─── DialogHeader ─────────────────────────────────────────────────────────────

describe('DialogHeader', () => {
  it('sets data-slot="dialog-header"', () => {
    const { container } = render(<DialogHeader />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-header')
  })

  it('forwards className', () => {
    const { container } = render(<DialogHeader className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(
      <DialogHeader>
        <span>Title</span>
      </DialogHeader>
    )
    expect(getByText('Title')).toBeInTheDocument()
  })
})

// ─── DialogTitle ──────────────────────────────────────────────────────────────

describe('DialogTitle', () => {
  it('sets data-slot="dialog-title"', () => {
    const { container } = render(<DialogTitle />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-title')
  })

  it('forwards className', () => {
    const { container } = render(<DialogTitle className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders text', () => {
    const { getByText } = render(<DialogTitle>My Dialog</DialogTitle>)
    expect(getByText('My Dialog')).toBeInTheDocument()
  })
})

// ─── DialogDescription ───────────────────────────────────────────────────────

describe('DialogDescription', () => {
  it('sets data-slot="dialog-description"', () => {
    const { container } = render(<DialogDescription />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-description')
  })

  it('renders a <p> element', () => {
    const { container } = render(<DialogDescription />)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('renders text', () => {
    const { getByText } = render(<DialogDescription>Confirm?</DialogDescription>)
    expect(getByText('Confirm?')).toBeInTheDocument()
  })
})

// ─── DialogFooter ─────────────────────────────────────────────────────────────

describe('DialogFooter', () => {
  it('sets data-slot="dialog-footer"', () => {
    const { container } = render(<DialogFooter />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-footer')
  })

  it('renders children', () => {
    const { getByText } = render(
      <DialogFooter>
        <button>Cancel</button>
      </DialogFooter>
    )
    expect(getByText('Cancel')).toBeInTheDocument()
  })
})

// ─── DialogOverlay ────────────────────────────────────────────────────────────

describe('DialogOverlay', () => {
  it('sets data-slot="dialog-overlay"', () => {
    const { container } = render(<DialogOverlay />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-overlay')
  })

  it('forwards className', () => {
    const { container } = render(<DialogOverlay className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── DialogTrigger ────────────────────────────────────────────────────────────

describe('DialogTrigger', () => {
  it('renders children', () => {
    const { getByText } = render(
      <DialogTrigger>
        <button>Open</button>
      </DialogTrigger>
    )
    expect(getByText('Open')).toBeInTheDocument()
  })
})

// ─── DialogClose ──────────────────────────────────────────────────────────────

describe('DialogClose', () => {
  it('sets data-slot="dialog-close"', () => {
    const { container } = render(<DialogClose />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'dialog-close')
  })
})
