import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system'
import { resolveImageUrl } from '@Common/imageUrl'
import { getUserInitials, type UserWithoutPassword } from '../../domain/Account'

type UserAvatarProps = {
  user?: Pick<UserWithoutPassword, 'firstName' | 'lastName' | 'avatar'>
  /** Alternative text of the picture — defaults to the first name */
  alt?: string
  className?: string
}

export const UserAvatar = ({ user, alt, className }: UserAvatarProps) => {
  const src = resolveImageUrl(user?.avatar)

  return (
    // Avatar remembers that its picture loaded: remount it when the picture changes or is removed,
    // otherwise the initials stay hidden behind a picture that is no longer there.
    <Avatar key={src ?? 'no-image'} className={className} data-testid="user-avatar" data-has-image={Boolean(src)}>
      {src && <AvatarImage src={src} alt={alt ?? user?.firstName ?? ''} />}
      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
    </Avatar>
  )
}
