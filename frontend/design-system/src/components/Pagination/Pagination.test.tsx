import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Pagination } from './Pagination'
import { PaginationContent } from './PaginationContent'
import { PaginationItem } from './PaginationItem'
import { PaginationLink } from './PaginationLink'
import { PaginationPrevious } from './PaginationPrevious'
import { PaginationNext } from './PaginationNext'
import { PaginationEllipsis } from './PaginationEllipsis'

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('Pagination', () => {
  it('sets data-slot="pagination"', () => {
    const { container } = render(<Pagination />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination')
  })

  it('renders a <nav> element', () => {
    const { container } = render(<Pagination />)
    expect(container.firstChild?.nodeName).toBe('NAV')
  })

  it('has role="navigation"', () => {
    const { container } = render(<Pagination />)
    expect(container.firstChild).toHaveAttribute('role', 'navigation')
  })

  it('has aria-label="pagination"', () => {
    const { container } = render(<Pagination />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'pagination')
  })

  it('forwards className', () => {
    const { container } = render(<Pagination className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── PaginationContent ────────────────────────────────────────────────────────

describe('PaginationContent', () => {
  it('sets data-slot="pagination-content"', () => {
    const { container } = render(<PaginationContent />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination-content')
  })

  it('renders a <ul> element', () => {
    const { container } = render(<PaginationContent />)
    expect(container.firstChild?.nodeName).toBe('UL')
  })
})

// ─── PaginationItem ───────────────────────────────────────────────────────────

describe('PaginationItem', () => {
  it('renders a <li> element', () => {
    const { container } = render(<PaginationItem />)
    expect(container.firstChild?.nodeName).toBe('LI')
  })
})

// ─── PaginationLink ───────────────────────────────────────────────────────────

describe('PaginationLink', () => {
  it('sets data-slot="pagination-link"', () => {
    const { container } = render(<PaginationLink href="#" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination-link')
  })

  it('renders an <a> element', () => {
    const { container } = render(<PaginationLink href="#" />)
    expect(container.firstChild?.nodeName).toBe('A')
  })

  it('sets aria-current="page" when active', () => {
    const { container } = render(<PaginationLink href="#" isActive />)
    expect(container.firstChild).toHaveAttribute('aria-current', 'page')
  })

  it('does not set aria-current when inactive', () => {
    const { container } = render(<PaginationLink href="#" />)
    expect(container.firstChild).not.toHaveAttribute('aria-current')
  })

  it('sets data-active when isActive', () => {
    const { container } = render(<PaginationLink href="#" isActive />)
    expect(container.firstChild).toHaveAttribute('data-active', 'true')
  })

  it('forwards className', () => {
    const { container } = render(<PaginationLink href="#" className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── PaginationPrevious ───────────────────────────────────────────────────────

describe('PaginationPrevious', () => {
  it('sets data-slot="pagination-previous"', () => {
    const { container } = render(<PaginationPrevious href="#" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination-previous')
  })

  it('has aria-label', () => {
    const { container } = render(<PaginationPrevious href="#" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Go to previous page')
  })
})

// ─── PaginationNext ───────────────────────────────────────────────────────────

describe('PaginationNext', () => {
  it('sets data-slot="pagination-next"', () => {
    const { container } = render(<PaginationNext href="#" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination-next')
  })

  it('has aria-label', () => {
    const { container } = render(<PaginationNext href="#" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Go to next page')
  })
})

// ─── PaginationEllipsis ───────────────────────────────────────────────────────

describe('PaginationEllipsis', () => {
  it('sets data-slot="pagination-ellipsis"', () => {
    const { container } = render(<PaginationEllipsis />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'pagination-ellipsis')
  })

  it('has role="presentation"', () => {
    const { container } = render(<PaginationEllipsis />)
    expect(container.firstChild).toHaveAttribute('role', 'presentation')
  })
})

// ─── Composed ─────────────────────────────────────────────────────────────────

describe('Pagination (composed)', () => {
  it('renders full pagination structure', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container.querySelector('[data-slot="pagination"]')).toBeInTheDocument()
    expect(container.querySelector('[aria-current="page"]')).toBeInTheDocument()
  })
})
