import type { IEmailService } from '../ports/IEmailService.js'
import { logger } from '../../../config/logger.js'

const TOKEN_LOGGING_ENVS = ['development', 'test']

/**
 * Stand-in until a real IEmailService exists: nothing is delivered.
 *
 * Logs never contain personal data (spec 10, Sécurité › Logs), so the recipient is never
 * logged. The token is a credential and the gate is fail-closed: it is only logged when
 * NODE_ENV is explicitly `development` or `test` (never when unset or anything else), so
 * activation and password reset stay usable locally. Otherwise only the absence of delivery
 * is logged.
 */
export class NoopEmailService implements IEmailService {
  async sendActivationEmail(_to: string, token: string): Promise<void> {
    this.logNotSent('activation', token)
  }

  async sendPasswordResetEmail(_to: string, token: string): Promise<void> {
    this.logNotSent('password reset', token)
  }

  private logNotSent(kind: string, token: string): void {
    if (!TOKEN_LOGGING_ENVS.includes(process.env.NODE_ENV ?? '')) {
      logger.warn(`[NOOP] ${kind} email not sent: no email provider configured`)
      return
    }
    logger.info(`[NOOP] ${kind} email not sent (${process.env.NODE_ENV}): token=${token}`)
  }
}
