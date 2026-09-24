import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ConfirmUserActionDialog, type UserAction } from './ConfirmUserActionDialog'

type Props = {
  action: UserAction
  userName: string
  open: boolean
  isPending: boolean
}

export class ConfirmUserActionDialogPage {
  onOpenChange = vi.fn()
  onConfirm = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { action: 'delete', userName: 'Jane Doe', open: true, isPending: false, ...props }
  }

  render() {
    render(<ConfirmUserActionDialog {...this.props} onOpenChange={this.onOpenChange} onConfirm={this.onConfirm} />)
    return this
  }

  title() {
    return screen.queryByText(`adminUsers.${this.props.action}.title`)
  }

  description() {
    return screen.getByText(`adminUsers.${this.props.action}.description`)
  }

  confirmButton() {
    return screen.getByText(`adminUsers.${this.props.action}.confirm`).closest('button')!
  }

  cancelButton() {
    return screen.getByText('adminUsers.dialog.cancel')
  }

  clickConfirm() {
    fireEvent.click(this.confirmButton())
    return this
  }

  clickCancel() {
    fireEvent.click(this.cancelButton())
    return this
  }
}
