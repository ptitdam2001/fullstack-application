import { GameShortDescription } from './GameShortDescription'
import type { Game } from '../domain/Game'

type GameListRawProps = { games: Game[] }

export const GameListRaw = ({ games }: GameListRawProps) => (
  <ul role="list" className="flex flex-1 flex-col gap-2 overflow-y-scroll px-2">
    {games.map((game, idx) => (
      <li key={`${game.id}-${idx}`} role="listitem">
        <GameShortDescription game={game} />
      </li>
    ))}
  </ul>
)
