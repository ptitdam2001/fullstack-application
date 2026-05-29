import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/design-system'
import { useGetMyTeams } from '@Sdk/user-team/user-team'
import { FormattedMessage, useIntl } from 'react-intl'
import { Activity, CalendarDays, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router'
import { AppSidebarFooter } from './AppSidebarFooter'

export const PlayerAppSidebar = () => {
  const { data: myTeams = [] } = useGetMyTeams()
  const playerTeams = myTeams.filter((ut) => ut.role === 'PLAYER').map((ut) => ut.team)
  const navigate = useNavigate()
  const intl = useIntl()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <FormattedMessage id="playerSidebar.globalView" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'playerSidebar.dashboard' })}
                  onClick={() => navigate('/app')}
                >
                  <LayoutDashboard />
                  <span>
                    <FormattedMessage id="playerSidebar.dashboard" />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <FormattedMessage id="playerSidebar.myTeam" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playerTeams.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground text-xs">
                      <FormattedMessage id="playerSidebar.noTeam" />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {playerTeams.map((team) => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton tooltip={team.name} onClick={() => navigate(`/app/team/${team.id}`)}>
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
            <FormattedMessage id="playerSidebar.season" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'playerSidebar.calendar' })}
                  onClick={() => navigate('/app/calendar')}
                >
                  <CalendarDays />
                  <span>
                    <FormattedMessage id="playerSidebar.calendar" />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={intl.formatMessage({ id: 'playerSidebar.games' })}
                  onClick={() => navigate('/app/games')}
                >
                  <Activity />
                  <span>
                    <FormattedMessage id="playerSidebar.games" />
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
