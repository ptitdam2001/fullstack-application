import { AvatarWithBadge } from '@Common/Avatar/AvatarWithBadge'
import { LinearProgress, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'

import { BaseTeamType } from '@Teams/types'
import { className as cn } from '@Common/utils/className'
import { useGetTeamPlayers } from '@Sdk/teams/teams'

type PlayerListProps = BaseTeamType & { className?: string }

export const PlayerList: React.FC<PlayerListProps> = ({ teamId, className }: PlayerListProps) => {
  const { data, isLoading } = useGetTeamPlayers(teamId)

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <List className={cn('w-full overflow-y-scroll h-full', className)} sx={{ bgcolor: 'background.paper' }}>
      {data?.map(player => (
        <ListItem alignItems="flex-start" key={player.id}>
          <ListItemAvatar>
            <AvatarWithBadge
              avatar={{ label: `${player.firstname} ${player.lastname}`, url: player.avatar ?? undefined }}
              badge={{
                content: player.jersey ? `${player.jersey}` : '-',
                className: 'text-white',
              }}
            />
          </ListItemAvatar>
          <ListItemText primary={`${player.firstname} ${player.lastname}`} />
        </ListItem>
      ))}
    </List>
  )
}
