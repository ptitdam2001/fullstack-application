import { TeamList } from '@Teams/List/TeamList'
import { Outlet } from 'react-router'
import { CirclePlus, LayoutGrid, List } from 'lucide-react'
import { MenuBar } from '@Common/MenuBar/MenuBar'
import { Button, Separator } from '@repo/design-system'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'

type ViewMode = 'grid' | 'list'

export const TeamsPage = () => {
  const [viewMode, setViewMode] = useLocalStorage('teams-view-mode', 'grid') as [ViewMode, (v: ViewMode) => void]

  return (
    <>
      <MenuBar
        leftActions={[{ url: 'create', label: <CirclePlus /> }]}
        rightActions={[
          <div key="view-toggle" className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              aria-label="List view"
              onClick={() => setViewMode('list')}
            >
              <List />
            </Button>
          </div>,
        ]}
      />
      <Separator orientation="horizontal" className="h-[1vh]" />
      <TeamList viewMode={viewMode} />
      <Outlet />
    </>
  )
}
