import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/design-system'
import { useAdminDashboard } from '@Dashboard/application/useAdminDashboard'
import { LayoutDashboard, Settings, Trophy, Users, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useIntl } from 'react-intl'
import { AppSidebarFooter } from './AppSidebarFooter'

export const AdminAppSidebar = () => {
  const { pendingScoreCount, pendingActivationCount } = useAdminDashboard()
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{formatMessage({ id: 'adminSidebar.globalView' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'navigation.dashboard' })}
                  onClick={() => navigate('/app')}
                >
                  <LayoutDashboard />
                  <span>{formatMessage({ id: 'navigation.dashboard' })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{formatMessage({ id: 'adminSidebar.management' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.championships' })}
                  onClick={() => navigate('/app/admin/championships')}
                >
                  <Trophy />
                  <span>{formatMessage({ id: 'adminSidebar.championships' })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.teams' })}
                  onClick={() => navigate('/app/admin/teams')}
                >
                  <Users />
                  <span>{formatMessage({ id: 'adminSidebar.teams' })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.gamesNeedsScore' })}
                  onClick={() => navigate('/app/games')}
                >
                  <CalendarDays />
                  <span>{formatMessage({ id: 'adminSidebar.gamesNeedsScore' })}</span>
                </SidebarMenuButton>
                {pendingScoreCount > 0 && <SidebarMenuBadge>{pendingScoreCount}</SidebarMenuBadge>}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.users' })}
                  onClick={() => navigate('/app/admin/users')}
                >
                  <Users />
                  <span>{formatMessage({ id: 'adminSidebar.users' })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.usersInactive' })}
                  onClick={() => navigate('/app/admin/users')}
                >
                  <Users />
                  <span>{formatMessage({ id: 'adminSidebar.usersInactive' })}</span>
                </SidebarMenuButton>
                {pendingActivationCount > 0 && <SidebarMenuBadge>{pendingActivationCount}</SidebarMenuBadge>}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{formatMessage({ id: 'adminSidebar.config' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={formatMessage({ id: 'adminSidebar.settings' })}
                  onClick={() => navigate('/app/settings')}
                >
                  <Settings />
                  <span>{formatMessage({ id: 'adminSidebar.settings' })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AppSidebarFooter />

      <SidebarRail />
    </Sidebar>
  )
}
