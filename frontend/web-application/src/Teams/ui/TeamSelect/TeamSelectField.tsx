import { useTeamOptions } from '../../application/useTeamOptions'
import { TeamSelect } from './TeamSelect'

type TeamSelectFieldProps = Omit<React.ComponentProps<typeof TeamSelect>, 'teams'>

export const TeamSelectField = (props: TeamSelectFieldProps) => {
  const teams = useTeamOptions()
  return <TeamSelect teams={teams} {...props} />
}
