import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import type { User } from '../../domain/User'
import { AdminUserFormSheet } from './AdminUserFormSheet'

type Props = {
  open: boolean
  user?: User
  isSelf: boolean
}

export class AdminUserFormSheetPage {
  onOpenChange = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { open: true, isSelf: false, ...props }
  }

  render() {
    render(<AdminUserFormSheet {...this.props} onOpenChange={this.onOpenChange} />)
    return this
  }

  title() {
    return screen.queryByText('adminUsers.dialog.edit.title')
  }

  form() {
    return screen.queryByTestId('admin-user-form')
  }
}
