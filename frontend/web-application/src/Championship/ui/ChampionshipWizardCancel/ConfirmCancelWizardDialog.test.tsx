import { describe, expect, it } from 'vitest'
import { ConfirmCancelWizardDialogPage } from './ConfirmCancelWizardDialog.page'

describe('ConfirmCancelWizardDialog', () => {
  it('renders title and description', () => {
    const page = new ConfirmCancelWizardDialogPage().render()
    expect(page.title()).toBeInTheDocument()
    expect(page.description()).toBeInTheDocument()
  })

  it('renders the three actions', () => {
    const page = new ConfirmCancelWizardDialogPage().render()
    expect(page.continueEditingButton()).toBeInTheDocument()
    expect(page.keepForLaterButton()).toBeInTheDocument()
    expect(page.deletePermanentlyButton()).toBeInTheDocument()
  })

  it('calls onOpenChange(false) when "continue editing" is clicked', () => {
    const page = new ConfirmCancelWizardDialogPage().render()
    page.clickContinueEditing()
    expect(page.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onKeepForLater when "keep for later" is clicked', () => {
    const page = new ConfirmCancelWizardDialogPage().render()
    page.clickKeepForLater()
    expect(page.onKeepForLater).toHaveBeenCalled()
  })

  it('calls onDeletePermanently when "delete permanently" is clicked', () => {
    const page = new ConfirmCancelWizardDialogPage().render()
    page.clickDeletePermanently()
    expect(page.onDeletePermanently).toHaveBeenCalled()
  })

  it('disables all actions while deleting', () => {
    const page = new ConfirmCancelWizardDialogPage({ isDeleting: true }).render()
    expect(page.continueEditingButton()).toBeDisabled()
    expect(page.keepForLaterButton()).toBeDisabled()
    expect(page.deletePermanentlyButton()).toBeDisabled()
  })
})
