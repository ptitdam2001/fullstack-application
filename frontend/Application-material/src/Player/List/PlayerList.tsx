import { AvatarWithBadge } from '@Common/Avatar/AvatarWithBadge'

import { BaseTeamType } from '@Teams/types'
import { className as cn } from '@Common/utils/className'
import { useGetTeamPlayers } from '@Sdk/teams/teams'
import { LinearProgress } from '@Common/Loading/LinearProgress'

type PlayerListProps = BaseTeamType & { className?: string }

export const PlayerList: React.FC<PlayerListProps> = ({ teamId, className }: PlayerListProps) => {
  const { data, isLoading } = useGetTeamPlayers(teamId)

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <ul className={cn('w-full overflow-y-scroll h-full', className)}>
      {data?.map(player => (
        <li className="flex flex-start py-2" key={player.id}>
          <div className="px-4">
            <AvatarWithBadge
              avatar={{ label: `${player.firstname} ${player.lastname}`, url: player.avatar ?? undefined }}
              badge={{
                content: player.jersey ? `${player.jersey}` : '-',
                className: 'text-white',
              }}
            />
          </div>
          <div className="grow-1">{`${player.firstname} ${player.lastname}`}</div>
        </li>
      ))}
    </ul>
  )
}
