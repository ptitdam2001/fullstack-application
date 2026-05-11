import { type Team } from '../domain/Team'
import { useGetTeams } from '../infrastructure/useTeamApi'

export const useTeamOptions = (): Team[] => {
  const { data } = useGetTeams()
  return data ?? []
}
