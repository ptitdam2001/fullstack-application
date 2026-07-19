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

type ConfirmDeleteAreaDialogProps = {
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export const ConfirmDeleteAreaDialog = ({
  name,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConfirmDeleteAreaDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="adminAreas.delete.title" />
          </DialogTitle>
          <DialogDescription className="pt-3 pb-5">
            <FormattedMessage id="adminAreas.delete.description" values={{ name }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <FormattedMessage id="adminAreas.delete.cancel" />
          </Button>
          <Button variant="destructive" onPress={onConfirm} isDisabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <FormattedMessage id="adminAreas.delete.confirm" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
)
