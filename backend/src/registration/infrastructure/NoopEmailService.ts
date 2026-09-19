import type { IEmailService } from '../ports/IEmailService.js'
import { logger } from '../../../config/logger.js'

/**
 * Stand-in until a real IEmailService exists: nothing is delivered.
 *
 * Logs never contain personal data (spec 10, Sécurité › Logs), so the recipient is never
 * logged. The token is a credential: it is only logged outside production, so activation
 * and password reset stay usable locally. In production only the absence of delivery is logged.
 */
export class NoopEmailService implements IEmailService {
  async sendActivationEmail(_to: string, token: string): Promise<void> {
    this.logNotSent('activation', token)
  }

  async sendPasswordResetEmail(_to: string, token: string): Promise<void> {
    this.logNotSent('password reset', token)
  }

  private logNotSent(kind: string, token: string): void {
    if (process.env.NODE_ENV === 'production') {
      logger.warn(`[NOOP] ${kind} email not sent: no email provider configured`)
      return
    }
    logger.info(`[NOOP] ${kind} email not sent (non-production): token=${token}`)
  }
}
