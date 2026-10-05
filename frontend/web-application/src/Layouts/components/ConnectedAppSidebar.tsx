import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/design-system'

import { type FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useNavigate } from 'react-router'
import { type LateralMenu } from '@Application/lateralMenu.config'
import { House } from 'lucide-react'
import { AppSidebarFooter } from './AppSidebarFooter'

type ConnectedAppSidebarProps = {
  links: LateralMenu
}

export const ConnectedAppSidebar: FC<ConnectedAppSidebarProps> = ({ links }) => {
  const navigate = useNavigate()
  const intl = useIntl()

  const handleClick = (url: string) => () => {
    navigate(url)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="px-1 pt-1">
          <House />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.main.map(({ labelId, url, icon }) => (
            <SidebarMenuItem key={url}>
              <SidebarMenuButton tooltip={intl.formatMessage({ id: labelId })} onClick={handleClick(url)}>
                {icon}
                <span>
                  <FormattedMessage id={labelId} />
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <AppSidebarFooter />

      <SidebarRail />
    </Sidebar>
  )
}
