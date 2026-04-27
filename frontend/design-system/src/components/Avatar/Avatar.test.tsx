import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { Avatar } from './Avatar'
import { AvatarImage } from './AvatarImage'
import { AvatarFallback } from './AvatarFallback'
import { AvatarWithBadge } from './AvatarWithBadge'

// ─── Avatar ──────────────────────────────────────────────────────────────────

describe('Avatar', () => {
  it('sets data-slot="avatar"', () => {
    const { container } = render(<Avatar />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'avatar')
  })

  it('renders a <span> element', () => {
    const { container } = render(<Avatar />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('forwards className', () => {
    const { container } = render(<Avatar className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(
      <Avatar>
        <span>content</span>
      </Avatar>
    )
    expect(getByText('content')).toBeInTheDocument()
  })
})

// ─── AvatarImage ──────────────────────────────────────────────────────────────

describe('AvatarImage', () => {
  it('sets data-slot="avatar-image"', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/img.png" alt="user" />
      </Avatar>
    )
    expect(container.querySelector('[data-slot="avatar-image"]')).toBeInTheDocument()
  })

  it('forwards alt and src', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/img.png" alt="Profile" />
      </Avatar>
    )
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/img.png')
    expect(img).toHaveAttribute('alt', 'Profile')
  })

  it('calls onLoad when image loads', () => {
    const onLoad = vi.fn()
    const { container } = render(
      <Avatar>
        <AvatarImage src="/img.png" onLoad={onLoad} />
      </Avatar>
    )
    const img = container.querySelector('img')!
    fireEvent.load(img)
    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('calls onError when image fails', () => {
    const onError = vi.fn()
    const { container } = render(
      <Avatar>
        <AvatarImage src="/bad.png" onError={onError} />
      </Avatar>
    )
    const img = container.querySelector('img')!
    fireEvent.error(img)
    expect(onError).toHaveBeenCalledOnce()
  })
})

// ─── AvatarFallback ───────────────────────────────────────────────────────────

describe('AvatarFallback', () => {
  it('renders fallback when no image is loaded', () => {
    const { getByText } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(getByText('AB')).toBeInTheDocument()
  })

  it('sets data-slot="avatar-fallback"', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeInTheDocument()
  })

  it('hides fallback after image loads successfully', () => {
    const { container, queryByText } = render(
      <Avatar>
        <AvatarImage src="/img.png" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    const img = container.querySelector('img')!
    act(() => {
      fireEvent.load(img)
    })
    expect(queryByText('AB')).not.toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback className="custom">AB</AvatarFallback>
      </Avatar>
    )
    expect(container.querySelector('[data-slot="avatar-fallback"]')).toHaveClass('custom')
  })
})

// ─── AvatarWithBadge ─────────────────────────────────────────────────────────

describe('AvatarWithBadge', () => {
  const defaultProps = {
    avatar: { url: '/avatar.png', label: 'User' },
    badge: { url: '/badge.png', label: 'Online' },
  }

  it('renders avatar and badge images', () => {
    const { getAllByRole } = render(<AvatarWithBadge {...defaultProps} />)
    const images = getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(1)
  })

  it('renders with sm size', () => {
    const { container } = render(<AvatarWithBadge {...defaultProps} size="sm" />)
    expect(container.querySelector('[data-slot="avatar"]')).toHaveClass('size-10')
  })

  it('renders with lg size', () => {
    const { container } = render(<AvatarWithBadge {...defaultProps} size="lg" />)
    expect(container.querySelector('[data-slot="avatar"]')).toHaveClass('size-18')
  })

  it('renders badge content when provided', () => {
    const { getByText } = render(<AvatarWithBadge avatar={{ label: 'U' }} badge={{ content: <span>★</span> }} />)
    expect(getByText('★')).toBeInTheDocument()
  })
})
