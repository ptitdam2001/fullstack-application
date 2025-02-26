import { Outlet, useLocation } from 'react-router-dom'
import { useSettingsMenu } from './hooks/useSettingsMenu'
import { LinkTabs } from '@Common/LinkTabs/LinkTabs'

export const SettingsLayout = () => {
  const tabs = useSettingsMenu()
  const location = useLocation()

  console.log('>>>> location:', location)

  return (
    <section className="w-full h-full">
      <LinkTabs tabs={tabs} name="Settings" />
      <Outlet />
    </section>
  )
}
