import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ConfirmDeleteSeasonDialog } from './ConfirmDeleteSeasonDialog'

type Props = {
  label: string
  open: boolean
  isPending: boolean
}

export class ConfirmDeleteSeasonDialogPage {
  onOpenChange = vi.fn()
  onConfirm = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { label: '2024-2025', open: true, isPending: false, ...props }
  }

  render() {
    render(<ConfirmDeleteSeasonDialog {...this.props} onOpenChange={this.onOpenChange} onConfirm={this.onConfirm} />)
    return this
  }

  title() {
    return screen.getByText('adminSeasons.delete.title')
  }

  description() {
    return screen.getByText('adminSeasons.delete.description')
  }

  confirmButton() {
    return screen.getByText('adminSeasons.delete.confirm').closest('button')!
  }

  cancelButton() {
    return screen.getByText('adminSeasons.delete.cancel')
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
