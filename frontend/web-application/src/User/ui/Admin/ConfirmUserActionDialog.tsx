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

/** Actions offered on a row of the users table. */
export type UserAction = 'delete' | 'activate' | 'unblock'

/** Everything this dialog can confirm: the row actions, plus the photo removal of the edit form. */
export type ConfirmableUserAction = UserAction | 'removeAvatar'

// Deleting an account or a photo is irreversible — activate/unblock stay on the neutral variant
const confirmVariant = {
  delete: 'destructive',
  removeAvatar: 'destructive',
  activate: 'default',
  unblock: 'default',
} as const satisfies Record<ConfirmableUserAction, 'destructive' | 'default'>

type ConfirmUserActionDialogProps = {
  action: ConfirmableUserAction
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export const ConfirmUserActionDialog = ({
  action,
  userName,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ConfirmUserActionDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id={`adminUsers.${action}.title`} />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id={`adminUsers.${action}.description`} values={{ userName }} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <FormattedMessage id="adminUsers.dialog.cancel" />
          </Button>
          <Button
            variant={confirmVariant[action]}
            data-variant={confirmVariant[action]}
            onPress={onConfirm}
            isDisabled={isPending}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <FormattedMessage id={`adminUsers.${action}.confirm`} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
)
