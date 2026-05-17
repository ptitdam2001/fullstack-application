import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { TeamJoinRequestUseCases } from '../application/TeamJoinRequestUseCases.js'
import { getAuthUserId } from '../../auth/application/requireRoles.js'
import { AlreadyMemberError, JoinRequestNotFoundError, JoinRequestNotPendingError } from '../domain/TeamJoinRequestErrors.js'
import { UnauthorizedError } from '../../auth/domain/AuthErrors.js'
import { PrismaTeamJoinRequestRepository } from './PrismaTeamJoinRequestRepository.js'
import { JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { logger } from '../../../config/logger.js'

const useCases = new TeamJoinRequestUseCases(new PrismaTeamJoinRequestRepository())

export const createTeamJoinRequest = async (ctx: Context, req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(ctx)
    const { teamId } = req.params
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
    const { teamId } = req.params
    const status = req.query.status as JoinRequestStatus | undefined
    const requests = await useCases.getTeamRequests(teamId, status)
    return res.status(200).json(requests)
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const updateTeamJoinRequest = async (ctx: Context, req: Request, res: Response) => {
  try {
    const approverId = getAuthUserId(ctx)
    const { teamId, requestId } = req.params
    const { action } = req.body as { action: 'approve' | 'refuse' }
    const request = await useCases.updateRequest(requestId, teamId, action, approverId)
    return res.status(200).json(request)
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof JoinRequestNotFoundError || err instanceof JoinRequestNotPendingError) {
      return res.status(404).json({ message: err.message, status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}