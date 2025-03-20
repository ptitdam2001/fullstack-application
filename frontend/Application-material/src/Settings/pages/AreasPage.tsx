import { AreaList } from '@Settings/Areas/AreaList'
import EditIcon from '@mui/icons-material/Edit'
import { Link, Outlet } from 'react-router'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export const AreaPages = () => {
  return (
    <article data-testid="AreaAdminPage" className="w-full h-full p-2 flex flex-col gap-1">
      <div className="px-1">
        <Link to="create">
          <AddCircleIcon />
        </Link>
      </div>
      <div className="flex-flex-grow-1">
        <AreaList
          actions={address => (
            <Link to={`${address._id}/edit`}>
              <EditIcon />
            </Link>
          )}
        />
      </div>

      <Outlet />
    </article>
  )
}
