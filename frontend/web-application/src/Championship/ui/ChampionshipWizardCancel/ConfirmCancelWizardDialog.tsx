import { Button, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { FormattedMessage } from 'react-intl'

type ConfirmCancelWizardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeletePermanently: () => void
  onKeepForLater: () => void
  isDeleting: boolean
}

export const ConfirmCancelWizardDialog = ({
  open,
  onOpenChange,
  onDeletePermanently,
  onKeepForLater,
  isDeleting,
}: ConfirmCancelWizardDialogProps) => (
  <DialogContent open={open} onOpenChange={onOpenChange}>
    <DialogHeader>
      <DialogTitle>
        <FormattedMessage id="championshipWizard.cancel.dialog.title" />
      </DialogTitle>
      <DialogDescription className="pt-3 pb-5">
        <FormattedMessage id="championshipWizard.cancel.dialog.description" />
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex-wrap">
      <Button variant="outline" onPress={() => onOpenChange(false)} isDisabled={isDeleting}>
        <FormattedMessage id="championshipWizard.cancel.dialog.continueEditing" />
      </Button>
      <Button variant="outline" onPress={onKeepForLater} isDisabled={isDeleting}>
        <FormattedMessage id="championshipWizard.cancel.dialog.keepForLater" />
      </Button>
      <Button variant="destructive" onPress={onDeletePermanently} isDisabled={isDeleting}>
        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
        <FormattedMessage id="championshipWizard.cancel.dialog.deletePermanently" />
      </Button>
    </DialogFooter>
  </DialogContent>
)
