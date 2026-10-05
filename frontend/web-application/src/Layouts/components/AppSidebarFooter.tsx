import { AuthProvider } from '@Auth/application/AuthProvider'
import { ACCOUNT_PAGE, LOGOUT_PAGE } from '@Auth/domain/Auth'
import { UserAvatar } from '@Auth/ui/UserAvatar/UserAvatar'
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@repo/design-system'
import { logout } from '@Sdk/authentication/authentication'
import { LogOutIcon } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

export const AppSidebarFooter = () => {
  const { user } = AuthProvider.useAuthValue()
  const navigate = useNavigate()
  const intl = useIntl()

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={intl.formatMessage({ id: 'coachSidebar.myProfile' })}
            onClick={() => navigate(ACCOUNT_PAGE)}
          >
            <UserAvatar user={user} className="h-5 w-5" />

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
