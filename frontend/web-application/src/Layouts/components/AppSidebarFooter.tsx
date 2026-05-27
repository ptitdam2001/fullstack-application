import { AuthProvider } from '@Auth/application/AuthProvider'
import { LOGOUT_PAGE } from '@Auth/domain/Auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/design-system'
import { logout } from '@Sdk/authentication/authentication'
import { LogOutIcon } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

export const AppSidebarFooter = () => {
  const { user } = AuthProvider.useAuthValue()
  const navigate = useNavigate()
  const intl = useIntl()

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map(n => n![0]?.toUpperCase())
    .join('')

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={intl.formatMessage({ id: 'coachSidebar.myProfile' })}
            onClick={() => navigate('/app/my-profile')}
          >
            <Avatar className="h-5 w-5">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.firstName ?? ''} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </SidebarMenuButton>

          <SidebarMenuButton
            tooltip={intl.formatMessage({ id: 'auth.signout' })}
            onClick={() => {
              logout()
              navigate(LOGOUT_PAGE)
            }}
          >
            <LogOutIcon />
            <span>
              <FormattedMessage id="auth.signout" />
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
