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

type ConfirmDeleteSeasonDialogProps = {
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export const ConfirmDeleteSeasonDialog = ({
  label,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConfirmDeleteSeasonDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="adminSeasons.delete.title" />
          </DialogTitle>
          <DialogDescription className="pt-3 pb-5">
            <FormattedMessage id="adminSeasons.delete.description" values={{ label }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <FormattedMessage id="adminSeasons.delete.cancel" />
          </Button>
          <Button variant="destructive" onPress={onConfirm} isDisabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <FormattedMessage id="adminSeasons.delete.confirm" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
)
