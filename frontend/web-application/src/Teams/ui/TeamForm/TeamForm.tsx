import type { CreateTeamMutationBody, Team } from '../../domain/Team'
import { CreateTeamForm } from './CreateTeamForm'
import { UpdateTeamForm } from './UpdateTeamForm'

type Props = {
  teamId?: string
  defaultValues?: CreateTeamMutationBody | Team
  onFinish?: VoidFunction
  className?: string
}

export const TeamForm = ({ teamId, defaultValues, ...props }: Props) => {
  if (teamId) {
    return <UpdateTeamForm teamId={teamId} defaultValues={defaultValues as Team | undefined} {...props} />
  }
  return <CreateTeamForm defaultValues={defaultValues as CreateTeamMutationBody | undefined} {...props} />
}
