import { describe, expect, it, vi } from 'vitest'
import { UserAvatarPage } from './UserAvatar.page'

vi.mock('@Config/axios-instance', () => ({ getBaseUrl: () => 'http://api.test/' }))

describe('UserAvatar', () => {
  it('shows the initials and no picture when the user has no avatar', () => {
    const page = new UserAvatarPage().render()

    expect(page.fallback('JD')).toBeInTheDocument()
    expect(page.image()).not.toBeInTheDocument()
    expect(page.root()).toHaveAttribute('data-has-image', 'false')
  })

  it('prefixes a relative avatar url with the API base url', () => {
    const page = new UserAvatarPage({ avatar: '/images/abc123' }).render()

    expect(page.image()).toHaveAttribute('src', 'http://api.test/images/abc123')
    expect(page.root()).toHaveAttribute('data-has-image', 'true')
  })

  it('uses an absolute avatar url as is', () => {
    const page = new UserAvatarPage({ avatar: 'https://cdn.example.org/jane.png' }).render()

    expect(page.image()).toHaveAttribute('src', 'https://cdn.example.org/jane.png')
  })

  it('labels the picture with the first name by default, or with the given alt', () => {
    expect(new UserAvatarPage({ avatar: '/images/abc123' }).render().image()).toHaveAttribute('alt', 'Jane')
  })

  it('labels the picture with the given alt', () => {
    const page = new UserAvatarPage({ avatar: '/images/abc123' }).withAlt('account.photo.alt').render()

    expect(page.image()).toHaveAttribute('alt', 'account.photo.alt')
  })

  it('renders an empty fallback without a user', () => {
    const page = new UserAvatarPage(null).render()

    expect(page.root()).toHaveAttribute('data-has-image', 'false')
    expect(page.image()).not.toBeInTheDocument()
  })
})
