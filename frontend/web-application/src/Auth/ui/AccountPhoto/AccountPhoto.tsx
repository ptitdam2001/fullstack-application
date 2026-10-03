import { useId } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { type UserWithoutPassword } from '../../domain/Account'
import { UserAvatar } from '../UserAvatar/UserAvatar'
import { useAccountPhoto } from './useAccountPhoto'

type AccountPhotoProps = {
  user: UserWithoutPassword
}

export const AccountPhoto = ({ user }: AccountPhotoProps) => {
  const intl = useIntl()
  const titleId = useId()
  const { inputRef, accept, openFilePicker, onFileChange, onRemove, error, errorKey, isUploading, isRemoving, isBusy } =
    useAccountPhoto()

  return (
    <Card.Container aria-labelledby={titleId} aria-busy={isBusy}>
      <Card.Header>
        <Card.Title id={titleId} role="heading" aria-level={2}>
          <FormattedMessage id="account.photo.title" />
        </Card.Title>
        <Card.Description>
          <FormattedMessage id="account.photo.description" />
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-wrap items-center gap-6">
        <UserAvatar user={user} alt={intl.formatMessage({ id: 'account.photo.alt' })} className="size-24 text-2xl" />
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              hidden
              data-testid="account-photo-input"
              onChange={onFileChange}
            />
            <Button variant="outline" onPress={openFilePicker} isDisabled={isBusy}>
              {isUploading && <Loader2 className="animate-spin" />}
              <FormattedMessage id="account.photo.choose" />
            </Button>
            {user.avatar && (
              <Button variant="ghost" onPress={onRemove} isDisabled={isBusy}>
                {isRemoving && <Loader2 className="animate-spin" />}
                <FormattedMessage id="account.photo.remove" />
              </Button>
            )}
          </div>
          {errorKey && (
            <p role="alert" data-error={error} className="text-destructive text-sm">
              <FormattedMessage id={errorKey} />
            </p>
          )}
        </div>
      </Card.Content>
    </Card.Container>
  )
}
