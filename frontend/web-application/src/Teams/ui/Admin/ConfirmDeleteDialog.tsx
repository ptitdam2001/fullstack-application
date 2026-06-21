import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { FormattedMessage } from 'react-intl'

type ConfirmDeleteDialogProps = {
  teamName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export const ConfirmDeleteDialog = ({ teamName, open, onOpenChange, onConfirm, isPending }: ConfirmDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="adminTeams.delete.title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="adminTeams.delete.description" values={{ teamName }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <FormattedMessage id="adminTeams.delete.cancel" />
          </Button>
          <Button variant="destructive" onPress={onConfirm} isDisabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <FormattedMessage id="adminTeams.delete.confirm" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
)
