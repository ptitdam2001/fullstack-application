import type { Request, RequestHandler } from 'express'
import morgan from 'morgan'

const OBJECT_ID = /\b[0-9a-f]{24}\b/gi
const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi

/** Drops the query string and masks object ids (they identify users, teams, matches...). */
export const sanitizePath = (url: string): string => url.split('?')[0].replace(UUID, ':id').replace(OBJECT_ID, ':id')

morgan.token<Request>('safe-path', req => sanitizePath(req.originalUrl ?? req.url ?? ''))

// Method, path, status, size and duration only: no IP, user-agent or referer (spec 10, Sécurité › Logs).
const FORMAT = ':method :safe-path :status :res[content-length] - :response-time ms'

export const createRequestLogger = (stream?: morgan.StreamOptions): RequestHandler => morgan(FORMAT, { stream })
