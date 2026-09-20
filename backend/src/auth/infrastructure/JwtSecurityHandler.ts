import type { Context } from 'openapi-backend'
import { AuthUseCases } from '../application/AuthUseCases.js'
import { PrismaUserRepository } from '../../user/infrastructure/PrismaUserRepository.js'
import { PrismaUserTeamRepository } from '../../userTeam/infrastructure/PrismaUserTeamRepository.js'
import { PrismaUserMatchRepository } from '../../userMatch/infrastructure/PrismaUserMatchRepository.js'
import { JwtAuthService } from './JwtAuthService.js'

const useCases = new AuthUseCases(
  new PrismaUserRepository(),
  new JwtAuthService(),
  new PrismaUserTeamRepository(),
  new PrismaUserMatchRepository()
)

/** `jwtAuth` security scheme: any throw makes openapi-backend answer 401. */
export const jwtSecurityHandler = async (ctx: Context) => {
  const authHeader = ctx.request.headers['authorization']
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }
  return useCases.authenticate(authHeader.replace('Bearer ', ''))
}
