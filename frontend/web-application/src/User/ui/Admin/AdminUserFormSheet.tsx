import { FormattedMessage } from 'react-intl'
import { SheetContent, SheetHeader, SheetTitle } from '@repo/design-system'
import type { User } from '../../domain/User'
import { AdminUserForm } from './AdminUserForm'

type AdminUserFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The row being edited — taken from the list, so no detail fetch is needed. */
  user?: User
  isSelf: boolean
}

export const AdminUserFormSheet = ({ open, onOpenChange, user, isSelf }: AdminUserFormSheetProps) => (
  <SheetContent open={open} onOpenChange={onOpenChange} side="right" className="flex flex-col gap-0 sm:max-w-md">
    <SheetHeader className="border-b px-6 py-4">
      <SheetTitle>
        <FormattedMessage id="adminUsers.dialog.edit.title" />
      </SheetTitle>
    </SheetHeader>
    <div className="flex grow flex-col overflow-y-auto px-6 py-4">
      {user && (
        // key: a fresh form per user, so defaultValues never leak from the previously edited row
        <AdminUserForm key={user.id} user={user} isSelf={isSelf} onFinish={() => onOpenChange(false)} />
      )}
    </div>
  </SheetContent>
)
