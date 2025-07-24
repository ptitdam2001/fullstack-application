import { TeamList } from '@Teams/List/TeamList'
import { Outlet } from 'react-router'
import { CirclePlus } from 'lucide-react'
import { MenuBar } from '@Common/MenuBar/MenuBar'

export const TeamsPage = () => (
  <article data-testid="TeamsPage" className="w-full h-full flex flex-col overflow-auto">
    <MenuBar leftActions={[{ url: 'create', label: <CirclePlus /> }]} />

    <TeamList />
    <Outlet />
  </article>
)
