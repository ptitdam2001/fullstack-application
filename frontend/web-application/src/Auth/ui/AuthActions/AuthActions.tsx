import { useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@repo/design-system'
import { AuthProvider } from '../../application/AuthProvider'
import { useLogoutAction } from '../../application/useLogoutAction'
import { LOGOUT_PAGE } from '../../domain/Auth'

export const AuthActions = () => {
  const { user, token } = AuthProvider.useAuthValue()
  const logout = useLogoutAction()
  const navigate = useNavigate()

  if (!user || !token) {
    return null
  }

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n![0]?.toUpperCase())
    .join('')

  return (
    <DropdownMenu>
      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
        <Avatar className="h-8 w-8">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.firstName ?? ''} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Button>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onAction={() => navigate('/app/my-profile')}>
            <FormattedMessage id="settings.account" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onAction={() => {
              logout()
              navigate(LOGOUT_PAGE)
            }}
          >
            <FormattedMessage id="auth.signout" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
