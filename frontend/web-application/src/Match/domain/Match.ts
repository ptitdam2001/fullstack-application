import { z } from 'zod'

export type { Match, MatchInput, MatchArea, MatchTeamSummary } from '@Sdk/model'
export { MatchStatus } from '@Sdk/model'

export const ScoreEntrySchema = z.object({
  homeGoals: z.number().int().min(0),
  awayGoals: z.number().int().min(0),
})

export type ScoreEntryValues = z.infer<typeof ScoreEntrySchema>
