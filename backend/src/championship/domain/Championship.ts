import type { PhaseType } from '../../phase/domain/Phase.js'

export type PointsConfig = {
  win: number
  draw: number
  loss: number
  forfeit: number
}

export type Championship = {
  id: string
  name: string
  ageCategoryId: string
  seasonId: string
  startDate: Date | null
  endDate: Date | null
  pointsConfig: PointsConfig
  createdAt: Date
  updatedAt: Date
}

// A championship is a draft until its phase has at least one group or bracket —
// those are only created in one shot, at the wizard's final submit step.
export type ChampionshipWithDraftStatus = Championship & {
  isDraft: boolean
  isFinished: boolean
  currentPhaseType: PhaseType | null
  teamsCount: number
  matchesPlayed: number
  matchesTotal: number
}

export type CreateChampionshipInput = Omit<Championship, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateChampionshipInput = Partial<CreateChampionshipInput>
