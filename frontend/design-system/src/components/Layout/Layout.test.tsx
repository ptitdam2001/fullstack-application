import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Layout } from './Layout'

describe('Layout.Root', () => {
  it("sets data-slot='layout'", () => {
    const { container } = render(<Layout.Root />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'layout')
  })

  it('renders a <div>', () => {
    const { container } = render(<Layout.Root />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('forwards className', () => {
    const { container } = render(<Layout.Root className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Layout.Root>content</Layout.Root>)
    expect(getByText('content')).toBeInTheDocument()
  })
})

describe('Layout.Header', () => {
  it("sets data-slot='layout-header'", () => {
    const { container } = render(<Layout.Header />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'layout-header')
  })

  it('renders a <header>', () => {
    const { container } = render(<Layout.Header />)
    expect(container.firstChild?.nodeName).toBe('HEADER')
  })

  it('forwards className', () => {
    const { container } = render(<Layout.Header className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Layout.Header>header</Layout.Header>)
    expect(getByText('header')).toBeInTheDocument()
  })
})

describe('Layout.Content', () => {
  it("sets data-slot='layout-content'", () => {
    const { container } = render(<Layout.Content />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'layout-content')
  })

  it('renders a <div>', () => {
    const { container } = render(<Layout.Content />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('forwards className', () => {
    const { container } = render(<Layout.Content className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Layout.Content>main content</Layout.Content>)
    expect(getByText('main content')).toBeInTheDocument()
  })

  it('applies stretch align by default', () => {
    const { container } = render(<Layout.Content />)
    expect(container.firstChild?.firstChild).toHaveClass('items-stretch')
  })

  it('applies center align', () => {
    const { container } = render(<Layout.Content align="center" />)
    expect(container.firstChild?.firstChild).toHaveClass('items-center')
  })

  it('applies start align', () => {
    const { container } = render(<Layout.Content align="start" />)
    expect(container.firstChild?.firstChild).toHaveClass('items-start')
  })
})

describe('Layout.Footer', () => {
  it("sets data-slot='layout-footer'", () => {
    const { container } = render(<Layout.Footer />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'layout-footer')
  })

  it('renders a <footer>', () => {
    const { container } = render(<Layout.Footer />)
    expect(container.firstChild?.nodeName).toBe('FOOTER')
  })

  it('forwards className', () => {
    const { container } = render(<Layout.Footer className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Layout.Footer>footer</Layout.Footer>)
    expect(getByText('footer')).toBeInTheDocument()
  })
})

describe('Layout (composed)', () => {
  it('renders full composition', () => {
    const { getByText } = render(
      <Layout.Root>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>Content</Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout.Root>
    )
    expect(getByText('Header')).toBeInTheDocument()
    expect(getByText('Content')).toBeInTheDocument()
    expect(getByText('Footer')).toBeInTheDocument()
  })

  it('renders correct nesting structure', () => {
    const { container } = render(
      <Layout.Root>
        <Layout.Header>h</Layout.Header>
        <Layout.Content>c</Layout.Content>
      </Layout.Root>
    )
    const root = container.querySelector("[data-slot='layout']")
    expect(root?.querySelector("[data-slot='layout-header']")).toBeInTheDocument()
    expect(root?.querySelector("[data-slot='layout-content']")).toBeInTheDocument()
  })
})
