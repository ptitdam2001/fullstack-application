import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'
import { BreadcrumbList } from './BreadcrumbList'
import { BreadcrumbItem } from './BreadcrumbItem'
import { BreadcrumbLink } from './BreadcrumbLink'
import { BreadcrumbPage } from './BreadcrumbPage'
import { BreadcrumbSeparator } from './BreadcrumbSeparator'
import { BreadcrumbEllipsis } from './BreadcrumbEllipsis'

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

describe('Breadcrumb', () => {
  it('sets data-slot="breadcrumb"', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb')
  })

  it('renders a <nav> element', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.firstChild?.nodeName).toBe('NAV')
  })

  it('has aria-label="breadcrumb"', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'breadcrumb')
  })

  it('renders children', () => {
    const { getByText } = render(
      <Breadcrumb>
        <span>child</span>
      </Breadcrumb>
    )
    expect(getByText('child')).toBeInTheDocument()
  })
})

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

describe('BreadcrumbList', () => {
  it('sets data-slot="breadcrumb-list"', () => {
    const { container } = render(<BreadcrumbList />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-list')
  })

  it('renders an <ol> element', () => {
    const { container } = render(<BreadcrumbList />)
    expect(container.firstChild?.nodeName).toBe('OL')
  })

  it('forwards className', () => {
    const { container } = render(<BreadcrumbList className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

describe('BreadcrumbItem', () => {
  it('sets data-slot="breadcrumb-item"', () => {
    const { container } = render(<BreadcrumbItem />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-item')
  })

  it('renders a <li> element', () => {
    const { container } = render(<BreadcrumbItem />)
    expect(container.firstChild?.nodeName).toBe('LI')
  })
})

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────

describe('BreadcrumbLink', () => {
  it('sets data-slot="breadcrumb-link"', () => {
    const { container } = render(<BreadcrumbLink href="/home" />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-link')
  })

  it('renders an <a> element by default', () => {
    const { container } = render(<BreadcrumbLink href="/home">Home</BreadcrumbLink>)
    expect(container.firstChild?.nodeName).toBe('A')
  })

  it('renders children', () => {
    const { getByText } = render(<BreadcrumbLink href="/home">Home</BreadcrumbLink>)
    expect(getByText('Home')).toBeInTheDocument()
  })

})

// ─── BreadcrumbPage ───────────────────────────────────────────────────────────

describe('BreadcrumbPage', () => {
  it('sets data-slot="breadcrumb-page"', () => {
    const { container } = render(<BreadcrumbPage />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-page')
  })

  it('has aria-current="page"', () => {
    const { container } = render(<BreadcrumbPage />)
    expect(container.firstChild).toHaveAttribute('aria-current', 'page')
  })

  it('renders children', () => {
    const { getByText } = render(<BreadcrumbPage>Settings</BreadcrumbPage>)
    expect(getByText('Settings')).toBeInTheDocument()
  })
})

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

describe('BreadcrumbSeparator', () => {
  it('sets data-slot="breadcrumb-separator"', () => {
    const { container } = render(<BreadcrumbSeparator />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-separator')
  })

  it('has role="presentation"', () => {
    const { container } = render(<BreadcrumbSeparator />)
    expect(container.firstChild).toHaveAttribute('role', 'presentation')
  })

  it('renders custom children', () => {
    const { getByText } = render(<BreadcrumbSeparator>/</BreadcrumbSeparator>)
    expect(getByText('/')).toBeInTheDocument()
  })
})

// ─── BreadcrumbEllipsis ───────────────────────────────────────────────────────

describe('BreadcrumbEllipsis', () => {
  it('sets data-slot="breadcrumb-ellipsis"', () => {
    const { container } = render(<BreadcrumbEllipsis />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'breadcrumb-ellipsis')
  })

  it('has role="presentation"', () => {
    const { container } = render(<BreadcrumbEllipsis />)
    expect(container.firstChild).toHaveAttribute('role', 'presentation')
  })

  it('forwards className', () => {
    const { container } = render(<BreadcrumbEllipsis className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})

// ─── Composed ─────────────────────────────────────────────────────────────────

describe('Breadcrumb (composed)', () => {
  it('renders full breadcrumb structure', () => {
    const { getByText } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Settings')).toBeInTheDocument()
  })
})
