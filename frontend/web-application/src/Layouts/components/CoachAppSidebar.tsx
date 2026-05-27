import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/design-system'
import { AuthProvider } from '@Auth/application/AuthProvider'
import { useCoachDashboard } from '@Dashboard/application/useCoachDashboard'
import { FormattedMessage, useIntl } from 'react-intl'
import { CalendarDays, LayoutDashboard, Plus, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'
import { AppSidebarFooter } from './AppSidebarFooter'

export const CoachAppSidebar = () => {
  const { user } = AuthProvider.useAuthValue()
  const { teams } = useCoachDashboard(user?.id ?? '')
  const navigate = useNavigate()
  const intl = useIntl()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <FormattedMessage id="coachSidebar.globalView" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'coachSidebar.dashboard' })}
                  onClick={() => navigate('/app')}
                >
                  <LayoutDashboard />
                  <span>
                    <FormattedMessage id="coachSidebar.dashboard" />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'coachSidebar.calendar' })}
                  onClick={() => navigate('/app/calendar')}
                >
                  <CalendarDays />
                  <span>
                    <FormattedMessage id="coachSidebar.calendar" />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <FormattedMessage id="coachSidebar.myTeams" />
          </SidebarGroupLabel>
          <SidebarGroupAction
            title={intl.formatMessage({ id: 'coachSidebar.newTeam' })}
            onClick={() => navigate('/teams/new')}
          >
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground text-xs">
                      <FormattedMessage id="coachSidebar.noTeam" />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {teams.map(team => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton tooltip={team.name} onClick={() => navigate(`/teams/${team.id}`)}>
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white"
                      style={{ backgroundColor: team.color ?? 'hsl(var(--primary))' }}
                    >
                      {team.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span>{team.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <FormattedMessage id="coachSidebar.season" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'coachSidebar.settings' })}
                  onClick={() => navigate('/app/settings')}
                >
                  <Settings />
                  <span>
                    <FormattedMessage id="coachSidebar.clubSettings" />
                  </span>
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
