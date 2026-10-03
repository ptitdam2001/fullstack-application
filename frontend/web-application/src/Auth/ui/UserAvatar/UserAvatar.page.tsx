import { render, screen } from '@testing-library/react'
import { type UserWithoutPassword } from '../../domain/Account'
import { UserAvatar } from './UserAvatar'

const defaultUser: UserWithoutPassword = { id: 'u1', firstName: 'Jane', lastName: 'Doe' }

export class UserAvatarPage {
  private readonly user?: UserWithoutPassword
  private alt?: string

  constructor(userOverrides: Partial<UserWithoutPassword> | null = {}) {
    this.user = userOverrides === null ? undefined : { ...defaultUser, ...userOverrides }
  }

  withAlt(alt: string) {
    this.alt = alt
    return this
  }

  render() {
    render(<UserAvatar user={this.user} alt={this.alt} />)
    return this
  }

  root() {
    return screen.getByTestId('user-avatar')
  }

  image() {
    return screen.queryByRole('img')
  }

  fallback(initials: string) {
    return screen.getByText(initials)
  }
}
