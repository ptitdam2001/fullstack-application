import type { IEmailService } from '../ports/IEmailService.js'
import { logger } from '../../../config/logger.js'

export class NoopEmailService implements IEmailService {
  async sendActivationEmail(to: string, token: string): Promise<void> {
    logger.info(`[NOOP] Activation email to ${to}: token=${token}`)
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    logger.info(`[NOOP] Password reset email to ${to}: token=${token}`)
  }
}
