import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { Typography } from './Typography'

describe('Typography.Title1', () => {
  it('renders as h1', () => {
    const { container } = render(<Typography.Title1>Title</Typography.Title1>)
    expect(container.querySelector('h1')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Title1>Title</Typography.Title1>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })

  it('forwards className', () => {
    const { container } = render(<Typography.Title1 className="custom">Title</Typography.Title1>)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Typography.Title1>Hello</Typography.Title1>)
    expect(getByText('Hello')).toBeInTheDocument()
  })
})

describe('Typography.Title2', () => {
  it('renders as h2', () => {
    const { container } = render(<Typography.Title2>Title</Typography.Title2>)
    expect(container.querySelector('h2')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Title2>Title</Typography.Title2>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('Typography.Title3', () => {
  it('renders as h3', () => {
    const { container } = render(<Typography.Title3>Title</Typography.Title3>)
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Title3>Title</Typography.Title3>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('Typography.Subtitle', () => {
  it('renders as p', () => {
    const { container } = render(<Typography.Subtitle>Subtitle</Typography.Subtitle>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Subtitle>Subtitle</Typography.Subtitle>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('Typography.Body', () => {
  it('renders as p', () => {
    const { container } = render(<Typography.Body>Body</Typography.Body>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Body>Body</Typography.Body>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })

  it('forwards className', () => {
    const { container } = render(<Typography.Body className="custom">Body</Typography.Body>)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<Typography.Body>Hello</Typography.Body>)
    expect(getByText('Hello')).toBeInTheDocument()
  })
})

describe('Typography (default = Body)', () => {
  it('renders as p', () => {
    const { container } = render(<Typography>Default</Typography>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography>Default</Typography>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('Typography.BodySmall', () => {
  it('renders as p', () => {
    const { container } = render(<Typography.BodySmall>Small</Typography.BodySmall>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.BodySmall>Small</Typography.BodySmall>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('Typography.Caption', () => {
  it('renders as span', () => {
    const { container } = render(<Typography.Caption>Caption</Typography.Caption>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('sets data-slot', () => {
    const { container } = render(<Typography.Caption>Caption</Typography.Caption>)
    expect(container.firstChild).toHaveAttribute('data-slot', 'typography')
  })
})

describe('color variants', () => {
  it('applies muted color', () => {
    const { container } = render(<Typography.Body color="muted">Muted</Typography.Body>)
    expect(container.firstChild).toHaveClass('text-muted-foreground')
  })

  it('applies primary color', () => {
    const { container } = render(<Typography.Body color="primary">Primary</Typography.Body>)
    expect(container.firstChild).toHaveClass('text-primary')
  })

  it('applies destructive color', () => {
    const { container } = render(<Typography.Body color="destructive">Error</Typography.Body>)
    expect(container.firstChild).toHaveClass('text-destructive')
  })

  it('applies default color', () => {
    const { container } = render(<Typography.Body color="default">Default</Typography.Body>)
    expect(container.firstChild).toHaveClass('text-foreground')
  })
})
