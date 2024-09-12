import { AppBar } from 'dsu-react-common'
import { Outlet } from 'react-router-dom'

export const AnonymousLayout = () => {
  return (
    <section className="h-full w-full">
      <AppBar title="Anonymous" />
      <main>
        <Outlet />
      </main>
    </section>
  )
}
