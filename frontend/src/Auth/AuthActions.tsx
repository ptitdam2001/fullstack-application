import { className as cn } from '@Common/utils/className'
import { AuthProvider } from './AuthProvider'
import { useNavigate } from 'react-router'
import { LOGOUT_PAGE } from './constant'

import { BadgeCheck, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type AuthActionsProps = {
  size?: 'small' | 'medium' | 'large'
}

export const AuthActions: React.FC<AuthActionsProps> = ({ size = 'medium' }) => {
  const { token, user } = AuthProvider.useAuthValue()
  const navigate = useNavigate()

  return token && user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className={cn('rounded-lg', size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-8 w-8' : 'h-10 w-10')}
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
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(LOGOUT_PAGE)}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null

  // return token ? (
  //   <Button
  //     variant="outlined"
  //     startIcon={<AccountCircleIcon />}
  //     component={Link}
  //     to={LOGOUT_PAGE}
  //     color={color}
  //     size={size}
  //   >
  //     Logout
  //   </Button>
  // ) : null
}
