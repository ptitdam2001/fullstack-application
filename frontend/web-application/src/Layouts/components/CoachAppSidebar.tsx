import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/design-system'
import { AuthProvider } from '@Auth/application/AuthProvider'
import { useCoachDashboard } from '@Dashboard/application/useCoachDashboard'
import { CalendarDays, CircleUserRound, LayoutDashboard, Plus, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

export const CoachAppSidebar = () => {
  const { user } = AuthProvider.useAuthValue()
  const { teams } = useCoachDashboard(user?.id ?? '')
  const navigate = useNavigate()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="px-1 pt-1 font-semibold tracking-tight">
          Handball
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vue globale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Tableau de bord" onClick={() => navigate('/app')}>
                  <LayoutDashboard />
                  <span>Tableau de bord</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Agenda" onClick={() => navigate('/app/calendar')}>
                  <CalendarDays />
                  <span>Agenda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mes équipes</SidebarGroupLabel>
          <SidebarGroupAction title="Nouvelle équipe" onClick={() => navigate('/teams/new')}>
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground text-xs">Aucune équipe</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {teams.map((team) => (
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
          <SidebarGroupLabel>Saison</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Paramètres" onClick={() => navigate('/app/settings')}>
                  <Settings />
                  <span>Paramètres club</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Mon profil" onClick={() => navigate('/app/my-profile')}>
              <CircleUserRound />
              <span>
                {user?.firstname} {user?.lastname}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
