import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from '@repo/design-system'
import { UserAvatar } from '@Auth/ui/UserAvatar/UserAvatar'
import type { User } from '../../domain/User'
import { ConfirmUserActionDialog } from './ConfirmUserActionDialog'
import { useAdminUserPhoto } from './useAdminUserPhoto'
import { userFullName } from './userFullName'

type AdminUserPhotoProps = {
  user: User
}

/**
 * Photo of the edited user. An admin never chooses it — a photo is only set by its owner from the account
 * page — but can take it down.
 */
export const AdminUserPhoto = ({ user }: AdminUserPhotoProps) => {
  const intl = useIntl()
  const { displayedUser, hasPhoto, isConfirmOpen, setIsConfirmOpen, askRemoval, confirmRemoval, isPending } =
    useAdminUserPhoto(user)

  return (
    <div className="flex items-center gap-4">
      <UserAvatar
        user={displayedUser}
        alt={intl.formatMessage({ id: 'adminUsers.photo.alt' }, { userName: userFullName(user) })}
        className="size-16 text-lg"
      />
      <div className="flex flex-col items-start gap-1">
        <p className="text-muted-foreground text-xs">
          <FormattedMessage id={hasPhoto ? 'adminUsers.photo.hint' : 'adminUsers.photo.none'} />
        </p>
        {hasPhoto && (
          <Button variant="outline" size="sm" onPress={askRemoval} isDisabled={isPending}>
            <FormattedMessage id="adminUsers.photo.remove" />
          </Button>
        )}
      </div>
      <ConfirmUserActionDialog
        action="removeAvatar"
        userName={userFullName(user)}
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmRemoval}
        isPending={isPending}
      />
    </div>
  )
}
