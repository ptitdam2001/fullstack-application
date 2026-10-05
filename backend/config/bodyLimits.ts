import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import { MAX_AVATAR_BASE64_LENGTH } from '../src/user/domain/Avatar.js'
import { bodyParserErrorType } from './bodyParserErrors.js'

// Room for the JSON around the base64 text: `{"contentType":"image/jpeg","data":"…"}`.
const AVATAR_JSON_ENVELOPE_BYTES = 1024

/** Largest PUT /me/avatar body: a picture of exactly MAX_AVATAR_BYTES, base64-encoded, plus its JSON envelope. */
export const AVATAR_BODY_LIMIT_BYTES = MAX_AVATAR_BASE64_LENGTH + AVATAR_JSON_ENVELOPE_BYTES

/**
 * Per-route JSON body limits, for the routes the default `express.json()` limit (100 kB) does not fit.
 * Must be mounted BEFORE the global `express.json()`: once a body is parsed, the global parser skips it.
 *
 * Only PUT /me/avatar is raised — a picture travels as base64, a third bigger than its bytes. Every other
 * route keeps the default limit.
 */
export const applyBodyLimits = (app: Express): void => {
  app.put(
    '/me/avatar',
    express.json({ limit: AVATAR_BODY_LIMIT_BYTES }),
    (err: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (bodyParserErrorType(err) === 'entity.too.large') {
        // 400 like the size check of the use case (openapi.yml documents no 413 on this route).
        return res.status(400).json({ status: 400, message: 'The image is too large' })
      }
      return next(err)
    }
  )
}
