import { Link, Outlet } from 'react-router-dom'

export const TeamList = () => (
  <div>
    Team List <Link to="/app/team/my-team">Here</Link>
    <Outlet />
  </div>
)
