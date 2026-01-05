import { AvatarWithBadge } from '@Common/Avatar/AvatarWithBadge'

import { BaseTeamType } from '@Teams/types'
import { className as cn } from '@Common/utils/className'
import { useGetTeamPlayers } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { TooltipTrigger, TooltipProvider, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'

type PlayerListProps = BaseTeamType & { className?: string }

const FetchPlayerList = ({ teamId, className }: PlayerListProps) => {
  const players = use(useGetTeamPlayers(teamId).promise)

  return (
    <ul className={cn('w-full overflow-y-scroll h-full', className)}>
      {players?.map(player => (
        <li className="flex flex-start py-2" key={player.id}>
          <div className="px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AvatarWithBadge
                    avatar={{
                      label: `${player.firstname.at(0)}${player.lastname.at(0)}`,
                      url: player.avatar ?? undefined,
                    }}
                    badge={{
                      content: player.jersey ? `${player.jersey}` : '-',
                      className: 'text-white',
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col">
                    <span>
                      {player.firstname} {player.lastname}
                    </span>
                    <span>Jersey #{player.jersey}</span>
                    <span>{player.position}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grow">{`${player.firstname} ${player.lastname}`}</div>
        </li>
      ))}
    </ul>
  )
}

export const PlayerList = ({ teamId, className }: PlayerListProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TableLoader nbCols={1} nbRows={15} />}>
      <FetchPlayerList teamId={teamId} className={className} />
    </Suspense>
  </ErrorBoundary>
)
