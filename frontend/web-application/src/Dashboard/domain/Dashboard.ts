export type CoachDashboardStats = {
  teamCount: number
  upcomingMatchCount: number
}

export type FeedEventType = 'ACTIVATION_REQUEST' | 'TEAM_CREATED' | 'FORFEIT' | 'MATCH_COMPLETED'

export type FeedEvent = {
  id: string
  type: FeedEventType
  date: string
  href?: string
  actionLabel?: string
  onAction?: () => void
  firstName?: string
  lastName?: string
}

export type RoleDistributionEntry = {
  role: string
  count: number
  color: string
}
