import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ConfirmCancelWizardDialog } from './ConfirmCancelWizardDialog'

type Props = {
  open: boolean
  isDeleting: boolean
}

export class ConfirmCancelWizardDialogPage {
  onOpenChange = vi.fn()
  onDeletePermanently = vi.fn()
  onKeepForLater = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { open: true, isDeleting: false, ...props }
  }

  render() {
    render(
      <ConfirmCancelWizardDialog
        {...this.props}
        onOpenChange={this.onOpenChange}
        onDeletePermanently={this.onDeletePermanently}
        onKeepForLater={this.onKeepForLater}
      />
    )
    return this
  }

  title() {
    return screen.getByText('championshipWizard.cancel.dialog.title')
  }

  description() {
    return screen.getByText('championshipWizard.cancel.dialog.description')
  }

  continueEditingButton() {
    return screen.getByText('championshipWizard.cancel.dialog.continueEditing').closest('button')!
  }

  keepForLaterButton() {
    return screen.getByText('championshipWizard.cancel.dialog.keepForLater').closest('button')!
  }

  deletePermanentlyButton() {
    return screen.getByText('championshipWizard.cancel.dialog.deletePermanently').closest('button')!
  }

  clickContinueEditing() {
    fireEvent.click(this.continueEditingButton())
    return this
  }

  clickKeepForLater() {
    fireEvent.click(this.keepForLaterButton())
    return this
  }

  clickDeletePermanently() {
    fireEvent.click(this.deletePermanentlyButton())
    return this
  }
}
