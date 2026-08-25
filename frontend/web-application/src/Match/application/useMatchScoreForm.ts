import {
  useEditMatch,
  getGetMatchesQueryKey,
  getCountMatchesQueryKey,
  getGetMatchQueryKey,
} from '../infrastructure/useMatchApi'
import { MatchStatus } from '../domain/Match'
import type { Match, MatchInput, ScoreEntryValues } from '../domain/Match'

export const useMatchScoreForm = (match: Match) => {
  const editMutation = useEditMatch({
    mutation: {
      meta: { invalidates: [getGetMatchesQueryKey(), getCountMatchesQueryKey(), getGetMatchQueryKey(match.id)] },
    },
  })

  const submitScore = (values: ScoreEntryValues) => {
    const data: MatchInput = {
      groupId: match.groupId,
      bracketId: match.bracketId,
      round: match.round,
      bracketPosition: match.bracketPosition,
      area: match.area,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      forfeitedBy: match.forfeitedBy,
      status: MatchStatus.PLAYED,
      homeGoals: values.homeGoals,
      awayGoals: values.awayGoals,
    }
    return editMutation.mutateAsync({ id: match.id, data })
  }

  return {
    submitScore,
    isPending: editMutation.isPending,
    isSuccess: editMutation.isSuccess,
    isError: editMutation.isError,
  }
}
