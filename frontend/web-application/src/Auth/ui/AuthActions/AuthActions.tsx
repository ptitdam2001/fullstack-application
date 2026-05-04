import { useNavigate } from 'react-router'
import { BadgeCheck, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@repo/design-system'
import { FormattedMessage } from '@/I18n/translation'
import { AuthProvider } from '../../application/AuthProvider'
import { LOGOUT_PAGE } from '../../domain/Auth'
import { type AvatarSize } from './types'
import { UserAvatar } from './UserAvatar'
import { UserAvatarButton } from './UserAvatarButton'

type AuthActionsProps = {
  size?: AvatarSize
}

export const AuthActions: React.FC<AuthActionsProps> = ({ size = 'medium' }) => {
  const { token, user } = AuthProvider.useAuthValue()
  const navigate = useNavigate()

  if (!token || !user) {
    return null
  }

  return (
    <DropdownMenu>
      <UserAvatarButton size={size} />

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <UserAvatar />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/app/my-profile')}>
            <BadgeCheck />
            <FormattedMessage id="settings.account" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(LOGOUT_PAGE)}>
            <LogOut />
            <FormattedMessage id="auth.signout" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
