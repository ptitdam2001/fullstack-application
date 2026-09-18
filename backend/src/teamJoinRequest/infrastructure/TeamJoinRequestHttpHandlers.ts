import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { TeamJoinRequestUseCases } from '../application/TeamJoinRequestUseCases.js'
import { getAuthPayload, getAuthUserId } from '../../auth/application/requireRoles.js'
import {
  AlreadyMemberError,
  JoinRequestNotFoundError,
  JoinRequestNotPendingError,
} from '../domain/TeamJoinRequestErrors.js'
import { ForbiddenError, UnauthorizedError } from '../../auth/domain/AuthErrors.js'
import { PrismaTeamJoinRequestRepository } from './PrismaTeamJoinRequestRepository.js'
import type { JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { UserTeamUseCases } from '../../userTeam/application/UserTeamUseCases.js'
import { PrismaUserTeamRepository } from '../../userTeam/infrastructure/PrismaUserTeamRepository.js'
import { logger } from '../../../config/logger.js'

const useCases = new TeamJoinRequestUseCases(new PrismaTeamJoinRequestRepository())
const userTeamUseCases = new UserTeamUseCases(new PrismaUserTeamRepository())

// Join requests are reviewed by an admin or a coach of the target team (specifications/10-inscription-et-authentification.md).
// Reads the role from the DB, not the JWT `isCoach` claim, so revoked/other-team coaches are rejected.
const requireTeamCoachOrAdmin = async (ctx: Context, teamId: string): Promise<void> => {
  const auth = getAuthPayload(ctx)
  if (auth.isAdmin) {
    return
  }
  if (!(await userTeamUseCases.hasRole(auth.userId, teamId, TeamRole.COACH))) {
    throw new ForbiddenError()
  }
}

export const createTeamJoinRequest = async (ctx: Context, req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(ctx)
    const { teamId } = ctx.request.params
    const { requestedRole } = req.body as { requestedRole: TeamRole }
    const request = await useCases.createRequest(userId, teamId, requestedRole)
    return res.status(201).json(request)
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof AlreadyMemberError) {
      return res.status(409).json({ message: 'Already a member of this team', status: 409 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const getTeamJoinRequests = async (ctx: Context, req: Request, res: Response) => {
  try {
    const { teamId } = ctx.request.params
    await requireTeamCoachOrAdmin(ctx, teamId)
    const status = req.query.status as JoinRequestStatus | undefined
    const requests = await useCases.getTeamRequests(teamId, status)
    return res.status(200).json(requests)
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const updateTeamJoinRequest = async (ctx: Context, req: Request, res: Response) => {
  try {
    const { teamId, requestId } = ctx.request.params
    await requireTeamCoachOrAdmin(ctx, teamId)
    const { action } = req.body as { action: 'approve' | 'refuse' }
    const request = await useCases.updateRequest(requestId, teamId, action)
    return res.status(200).json(request)
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof JoinRequestNotFoundError || err instanceof JoinRequestNotPendingError) {
      return res.status(404).json({ message: err.message, status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
