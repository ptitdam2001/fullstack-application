import { AreaList } from '@Settings/Areas/AreaList'
import { Link, Outlet } from 'react-router'
import { Edit, HousePlus } from 'lucide-react'

export const AreaPages = () => (
  <article data-testid="AreaAdminPage" className="w-full h-full p-2 flex flex-col gap-1">
    <div className="px-1">
      <Link to="create">
        <HousePlus />
      </Link>
    </div>
    <div className="flex-flex-grow-1">
      <AreaList
        actions={address => (
          <Link to={`${address._id}/edit`}>
            <Edit />
          </Link>
        )}
      />
    </div>

    <Outlet />
  </article>
)
