import { cn, TooltipTrigger, TooltipProvider, TooltipContent, Tooltip, AvatarWithBadge } from '@repo/design-system'
import { TableLoader } from '@Common/Loading'
import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import type { TeamId } from '../domain/Player'
import { usePlayerList } from '../application/usePlayerList'

type PlayerListProps = TeamId & { className?: string }

const PlayerListInner = ({ teamId, className }: PlayerListProps) => {
  const players = use(usePlayerList(teamId).promise)
  return (
    <ul className={cn('h-full w-full overflow-y-scroll', className)}>
      {players?.map(player => (
        <li className="flex-start flex py-2" key={player.id}>
          <div className="px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AvatarWithBadge
                    avatar={{ label: player.userId.slice(0, 2).toUpperCase() }}
                    badge={{
                      content: player.jersey != null ? `${player.jersey}` : '-',
                      className: 'text-white',
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col">
                    <span>#{player.jersey ?? '-'}</span>
                    {player.position && <span>{player.position}</span>}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grow text-sm text-muted-foreground">{player.userId}</div>
        </li>
      ))}
    </ul>
  )
}

export const PlayerList = ({ teamId, className }: PlayerListProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TableLoader nbCols={1} nbRows={15} />}>
      <PlayerListInner teamId={teamId} className={className} />
    </Suspense>
  </ErrorBoundary>
)
