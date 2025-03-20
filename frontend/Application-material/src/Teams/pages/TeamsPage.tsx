import { TeamList } from '@Teams/List/TeamList'
import { Link, Outlet } from 'react-router'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export const TeamsPage = () => (
  <article data-testid="TeamsPage" className="w-full h-full flex flex-col overflow-auto">
    <div className="px-1">
      <Link to="create">
        <AddCircleIcon />
      </Link>
    </div>
    <TeamList />
    <Outlet />
  </article>
)
