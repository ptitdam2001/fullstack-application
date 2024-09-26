import { UserCard } from '@Common/UserCard'

export const Team = () => {
  const players: { login: string }[] = []
  return (
    <article>
      {players.map(player => (
        <UserCard user={player} />
      ))}
    </article>
  )
}
