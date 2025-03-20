import { Outlet } from 'react-router'
import { useSettingsMenu } from './hooks/useSettingsMenu'
import { LinkTabs } from '@Common/LinkTabs/LinkTabs'
import { LinkTab } from '@Common/LinkTabs/LinkTab'
import { Divider } from '@mui/material'

export const SettingsLayout = () => {
  const { list } = useSettingsMenu()

  return (
    <section className="w-full h-full flex flex-col">
      <LinkTabs name="Settings" defaultIndex={0}>
        {list.map((elt, idx) => (
          <LinkTab key={elt.href} {...{ ...elt, tabIndex: idx }} />
        ))}
      </LinkTabs>
      <Divider />
      <section className="flex flex-col overflow-auto">
        <Outlet />
      </section>
    </section>
  )
}
