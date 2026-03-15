import { GameShortDescription } from '@Game/ShortDescription/GameShortDescription'
import { Game } from '@Sdk/model'

type GameListRawProps = {
  games: Game[]
}

export const GameListRaw = ({ games }: GameListRawProps) => (
  <ul role="list" className="flex-1 flex flex-col gap-2 overflow-y-scroll px-2">
    {games.map((game, idx) => (
      <li key={`${game.id}-${idx}`} role="listitem">
        <GameShortDescription game={game} />
      </li>
    ))}
  </ul>
)
