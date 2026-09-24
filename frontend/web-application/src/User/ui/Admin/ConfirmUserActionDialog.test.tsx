import { describe, expect, it } from 'vitest'
import { ConfirmUserActionDialogPage } from './ConfirmUserActionDialog.page'

describe('ConfirmUserActionDialog', () => {
  it.each(['delete', 'activate', 'unblock'] as const)('renders the %s title, description and confirm', action => {
    const page = new ConfirmUserActionDialogPage({ action }).render()
    expect(page.title()).toBeInTheDocument()
    expect(page.description()).toBeInTheDocument()
    expect(page.confirmButton()).toBeInTheDocument()
  })

  it('marks the confirm button destructive for delete only', () => {
    const page = new ConfirmUserActionDialogPage({ action: 'delete' }).render()
    expect(page.confirmButton()).toHaveAttribute('data-variant', 'destructive')
  })

  it('keeps activate non-destructive', () => {
    const page = new ConfirmUserActionDialogPage({ action: 'activate' }).render()
    expect(page.confirmButton()).toHaveAttribute('data-variant', 'default')
  })

  it('calls onConfirm when confirm is clicked', () => {
    const page = new ConfirmUserActionDialogPage().render().clickConfirm()
    expect(page.onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', () => {
    const page = new ConfirmUserActionDialogPage().render().clickCancel()
    expect(page.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm while pending', () => {
    const page = new ConfirmUserActionDialogPage({ isPending: true }).render()
    expect(page.confirmButton()).toBeDisabled()
  })

  it('renders nothing when closed', () => {
    const page = new ConfirmUserActionDialogPage({ open: false }).render()
    expect(page.title()).not.toBeInTheDocument()
  })
})
