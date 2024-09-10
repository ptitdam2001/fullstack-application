import { Link, Outlet } from 'react-router-dom'
import { LOGOUT_PAGE } from '../Auth/constant'

export const ConnectedLayout = () => {
  return (
    <>
      <div>
        Connected <Link to={LOGOUT_PAGE}>Logout</Link>
      </div>
      <Outlet />
    </>
  )
}
