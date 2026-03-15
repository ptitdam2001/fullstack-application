import { Card, CardContent } from '@/components/ui/card'
import { Address } from '@Common/Address/Address'
import { Game } from '@Sdk/model'

type GameListItemProps = {
  game: Game
}

export const GameShortDescription = ({ game }: GameListItemProps) => {
  const {
    teams: [homeTeam, awayTeam],
    date,
    area,
  } = game
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/3">{homeTeam.name}</div>
            <div className="w-1/3 text-center">
              <h6>
                {homeTeam.score ?? 0} - {awayTeam.score ?? 0}
              </h6>
            </div>
            <div className="w-1/3">{awayTeam.name}</div>
          </div>
          <p>{date}</p>
          {area && <Address address={area} />}
        </div>
      </CardContent>
    </Card>
  )
}
