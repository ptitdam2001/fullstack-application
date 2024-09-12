import { Link, Outlet } from 'react-router-dom'
import { LOGOUT_PAGE } from '../Auth/constant'
import { AppBar, Close } from 'dsu-react-common'

export const ConnectedLayout = () => {
  return (
    <section className="h-full w-full max-h-max">
      <AppBar title="Connected" />
      <main className="h-screen flex flex-col">
        <div>
          <Link to={LOGOUT_PAGE} className="flex flex-row gap-1">
            <Close className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
        <div className="flex-grow">
          <Outlet />
        </div>
      </main>
    </section>
  )
}
