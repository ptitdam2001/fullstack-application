import { useNavigate } from 'react-router'
import { BadgeCheck, LogOut } from 'lucide-react'
import {
  cn,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system'
import { FormattedMessage } from '@/I18n/translation'
import { AuthProvider } from '../application/AuthProvider'
import { LOGOUT_PAGE } from '../domain/Auth'

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
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'cursor-pointer rounded-full p-0',
          size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-8 w-8' : 'h-10 w-10'
        )}
        aria-label="User menu"
      >
        <Avatar
          className={cn(
            'rounded-lg',
            size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-8 w-8' : 'h-10 w-10'
          )}
        >
          <AvatarImage src={user?.avatar} alt={user.firstname} />
          <AvatarFallback className="rounded-lg">{`${user.firstname?.at(0)}${user.lastname?.at(0)}`}</AvatarFallback>
        </Avatar>
      </Button>
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
