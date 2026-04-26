import { Outlet } from 'react-router'

export const TeamLayout = () => (
  <section className="flex h-full w-full flex-col">
    <Outlet />
  </section>
)
