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

type ConfirmDeleteAgeCategoryDialogProps = {
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export const ConfirmDeleteAgeCategoryDialog = ({
  label,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConfirmDeleteAgeCategoryDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="adminAgeCategories.delete.title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="adminAgeCategories.delete.description" values={{ label }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <FormattedMessage id="adminAgeCategories.delete.cancel" />
          </Button>
          <Button variant="destructive" onPress={onConfirm} isDisabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <FormattedMessage id="adminAgeCategories.delete.confirm" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
)
