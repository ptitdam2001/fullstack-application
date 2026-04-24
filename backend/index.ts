import cors from 'cors'
import express, { type NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import { rateLimit } from 'express-rate-limit'
const { TokenExpiredError } = jwt
type Secret = jwt.Secret

import { OpenAPIBackend, type Request as RequestOpenApi } from 'openapi-backend'
import helmet from 'helmet'

import { UnauthorizedError, ForbiddenError } from './src/auth/domain/AuthErrors'
import * as authHandlers from './src/auth/infrastructure/AuthHttpHandlers'
import * as userHandlers from './src/user/infrastructure/UserHttpHandlers'
import * as teamHandlers from './src/team/infrastructure/TeamHttpHandlers'
import * as matchHandlers from './src/match/infrastructure/MatchHttpHandlers'
import * as championshipHandlers from './src/championship/infrastructure/ChampionshipHttpHandlers'
import * as userTeamHandlers from './src/userTeam/infrastructure/UserTeamHttpHandlers'
import * as userMatchHandlers from './src/userMatch/infrastructure/UserMatchHttpHandlers'

import { logger } from './config/logger'
import { prisma } from './utils/prismaClient'
import addFormats from 'ajv-formats'

// configures dotenv to work in your application
dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  })
)

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 429, message: 'Too many login attempts, please try again later.' },
})
app.post('/login', loginRateLimit)

const api = new OpenAPIBackend({
  definition: './openapi.yml',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customizeAjv: (ajv: any) => {
    // add standard formats (date-time, email, hostname, ipv4, etc.)
    addFormats(ajv)

    // custom formats (øsee https://ajv.js.org/guide/formats.html for more details)
    ajv.addFormat('color', /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    ajv.addFormat('score', { type: 'number', minimum: 0, maximum: 100 })

    return ajv
  },
  handlers: {
    ...authHandlers,
    ...userHandlers,
    ...teamHandlers,
    ...matchHandlers,
    ...championshipHandlers,
    ...userTeamHandlers,
    ...userMatchHandlers,
    validationFail: (c, _: Request, res: Response) => res.status(400).json({ err: c.validation.errors }),
    notFound: (c, _: Request, res: Response) =>
      res
        .status(404)
        .json({
          err: 'not found',
          operation: c.operation?.operationId,
          status: 404,
          path: c.operation?.path,
          method: c.operation?.method,
        }),
    methodNotAllowed: (_, _1, res: Response) => res.status(405).json({ status: 405, err: 'Method not allowed' }),
    notImplemented: (_, _1, res: Response) =>
      res.status(404).json({ status: 501, err: 'No handler registered for operation' }),
    unauthorizedHandler: (_, _0, res: Response) =>
      res.status(401).json({ status: 401, err: 'Please authenticate first' }),
  },
})

api.registerSecurityHandler('jwtAuth', ctx => {
  const authHeader = ctx.request.headers['authorization']
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    return jwt.verify(token, process.env.JWT_SECRET as Secret)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new Error('Token has expired', { cause: err })
    }
    throw err
  }
})

api.init()

// logging
app.use(morgan('combined'))

// use as express middleware
app.use((req: RequestOpenApi, res: Request) => api.handleRequest(req, req, res))

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof UnauthorizedError) return res.status(401).json({ status: 401, message: 'Unauthorized' })
  if (err instanceof ForbiddenError) return res.status(403).json({ status: 403, message: 'Forbidden' })
  logger.error(err)
  return res.status(500).json({ status: 500, message: 'Internal server error' })
})

prisma
  .$connect()
  .then(() => {
    logger.info('Database connected')
    app
      .listen(PORT, () => {
        logger.info('Server running at PORT: %d', PORT)
      })
      .on('error', error => {
        throw new Error(error.message)
      })
  })
  .catch(error => {
    logger.error('Failed to connect to database: %s', error.message)
    process.exit(1)
  })
