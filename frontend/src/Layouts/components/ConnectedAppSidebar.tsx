import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

import { FC } from 'react'
import { Link, useNavigate } from 'react-router'
import { LateralMenu } from '@Application/lateralMenu.config'
import { House } from 'lucide-react'

type ConnectedAppSidebarProps = {
  links: LateralMenu
}

export const ConnectedAppSidebar: FC<ConnectedAppSidebarProps> = ({ links }) => {
  const navigate = useNavigate()

  const handleClick = (url: string) => () => {
    navigate(url)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/">
          <House />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.main &&
            links.main.map(({ label, url, icon }) => (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton tooltip={label} onClick={handleClick(url)}>
                  {icon}
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {links.footer && (
          <SidebarMenu>
            {links.footer.map(({ label, url, icon }) => (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton tooltip={label} onClick={handleClick(url)}>
                  {icon}
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
