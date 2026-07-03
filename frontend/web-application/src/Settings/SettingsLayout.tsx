import { Outlet } from 'react-router'

export const SettingsLayout = () => (
  <section className="flex h-full w-full flex-col">
    <section className="flex h-full flex-col overflow-auto">
      <Outlet />
    </section>
  </section>
)
