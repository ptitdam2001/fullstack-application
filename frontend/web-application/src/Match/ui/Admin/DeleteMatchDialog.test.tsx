import { describe, expect, it } from 'vitest'
import { DeleteMatchDialogPage } from './DeleteMatchDialog.page'

describe('DeleteMatchDialog', () => {
  it('renders title and description', () => {
    const page = new DeleteMatchDialogPage().render()
    expect(page.title()).toBeInTheDocument()
    expect(page.description()).toBeInTheDocument()
  })

  it('calls onOpenChange(false) when cancel is clicked', () => {
    const page = new DeleteMatchDialogPage().render()
    page.clickCancel()
    expect(page.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onConfirm when confirm is clicked', () => {
    const page = new DeleteMatchDialogPage().render()
    page.clickConfirm()
    expect(page.onConfirm).toHaveBeenCalled()
  })

  it('disables both actions while pending', () => {
    const page = new DeleteMatchDialogPage({ isPending: true }).render()
    expect(page.cancelButton()).toBeDisabled()
    expect(page.confirmButton()).toBeDisabled()
  })
})
