import { AuthProvider } from './AuthProvider'
import { useNavigate } from 'react-router'
import { LOGOUT_PAGE } from './constant'

import { BadgeCheck, LogOut } from 'lucide-react'
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system'
import { FormattedMessage } from '@/I18n/translation'

type AuthActionsProps = {
  size?: 'small' | 'medium' | 'large'
}

export const AuthActions: React.FC<AuthActionsProps> = ({ size = 'medium' }) => {
  const { token, user } = AuthProvider.useAuthValue()
  const navigate = useNavigate()

  if (!token || !user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className={cn(
            'rounded-lg',
            'cursor-pointer',
            size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-8 w-8' : 'h-10 w-10'
          )}
          role="button"
        >
          <AvatarImage src={user?.avatar} alt={user.firstname} />
          <AvatarFallback className="rounded-lg">{`${user.firstname?.at(0)}${user.lastname?.at(0)}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.firstname} />
              <AvatarFallback className="rounded-lg">{`${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.firstname}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/app/my-profile')}>
            <BadgeCheck />
            <FormattedMessage id="settings.account" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(LOGOUT_PAGE)}>
          <LogOut />
          <FormattedMessage id="auth.signout" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
