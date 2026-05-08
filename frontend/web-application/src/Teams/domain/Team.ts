export type { Team, TeamWithoutId, Area } from '@Sdk/model'
export type { CreateTeamMutationBody, UpdateTeamMutationBody } from '@Sdk/team/team'
export type { GetTeamsParams, GetTeamCalendarParams } from '@Sdk/model'
export { CreateTeamBody, UpdateTeamBody } from '@Sdk/team/team.zod'

export type TeamId = { teamId: string }
