import { describe, expect, it } from 'vitest'
import { ConfirmDeleteSeasonDialogPage } from './ConfirmDeleteSeasonDialog.page'

describe('ConfirmDeleteSeasonDialog', () => {
  it('renders title and description', () => {
    const page = new ConfirmDeleteSeasonDialogPage().render()
    expect(page.title()).toBeInTheDocument()
    expect(page.description()).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons', () => {
    const page = new ConfirmDeleteSeasonDialogPage().render()
    expect(page.confirmButton()).toBeInTheDocument()
    expect(page.cancelButton()).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const page = new ConfirmDeleteSeasonDialogPage().render()
    page.clickConfirm()
    expect(page.onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', () => {
    const page = new ConfirmDeleteSeasonDialogPage().render()
    page.clickCancel()
    expect(page.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm button when isPending', () => {
    const page = new ConfirmDeleteSeasonDialogPage({ isPending: true }).render()
    expect(page.confirmButton()).toBeDisabled()
  })
})
