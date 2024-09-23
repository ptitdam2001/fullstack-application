import { UserCard } from '@Common/UserCard'

export const Team = () => {
  const players: any[] = []
  return (
    <article>
      {players.map(player => (
        <UserCard user={player} />
      ))}
    </article>
  )
}
