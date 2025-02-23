import { Address } from '@Common/Address/Address'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { Game } from '@Sdk/model'

type GameListItemProps = {
  game: Game
}

export const GameListItem = ({ game }: GameListItemProps) => {
  const {
    teams: [homeTeam, awayTeam],
    date,
    area,
  } = game
  return (
    <Card variant="elevation" sx={theme => ({ background: theme.palette.info.light })}>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/3">
              <Typography variant="body1">{homeTeam.name}</Typography>
            </div>
            <div className="w-1/3 text-center">
              <Typography variant="h6" color="textPrimary">
                {homeTeam.score ?? 0} - {awayTeam.score ?? 0}
              </Typography>
            </div>
            <div className="w-1/3">
              <Typography variant="body1">{awayTeam.name}</Typography>
            </div>
          </div>
          <Box>{date}</Box>
          {area && <Address address={area} />}
        </div>
      </CardContent>
    </Card>
  )
}
