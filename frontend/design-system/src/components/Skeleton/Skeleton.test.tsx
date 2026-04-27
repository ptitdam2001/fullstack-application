import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('sets data-slot="skeleton"', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'skeleton')
  })

  it('forwards className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />)
    expect(container.firstChild).toHaveClass('h-4', 'w-full')
  })

  it('applies pulse animation class', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('renders children', () => {
    const { getByText } = render(<Skeleton>Loading...</Skeleton>)
    expect(getByText('Loading...')).toBeInTheDocument()
  })
})
