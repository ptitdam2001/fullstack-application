import { Outlet } from 'react-router'
import { useSettingsMenu } from './hooks/useSettingsMenu'
import { LinkTabs } from '@Common/LinkTabs/LinkTabs'
import { LinkTab } from '@Common/LinkTabs/LinkTab'
import { Separator } from '@repo/design-system'
import { TabsList } from '@repo/design-system'

export const SettingsLayout = () => {
  const { list } = useSettingsMenu()

  return (
    <section className="w-full h-full flex flex-col">
      <LinkTabs name="Settings" defaultValue="areas">
        <TabsList>
          {list.map(elt => (
            <LinkTab key={elt.href} {...{ ...elt, tabIndex: elt.href }} />
          ))}
        </TabsList>
      </LinkTabs>
      <Separator />
      <section className="flex flex-col overflow-auto">
        <Outlet />
      </section>
    </section>
  )
}
