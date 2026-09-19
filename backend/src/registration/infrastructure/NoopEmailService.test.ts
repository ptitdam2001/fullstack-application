import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../config/logger.js', () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }))

import { logger } from '../../../config/logger.js'
import { NoopEmailService } from './NoopEmailService.js'

const EMAIL = 'alice.dupont@example.com'
const TOKEN = '3f2b8c1e-9d4a-4e7b-a1c5-0b6d2f8e7a90'

const everythingLogged = (): string =>
  JSON.stringify([
    ...vi.mocked(logger.info).mock.calls,
    ...vi.mocked(logger.warn).mock.calls,
    ...vi.mocked(logger.error).mock.calls,
  ])

const sends = {
  activation: (service: NoopEmailService) => service.sendActivationEmail(EMAIL, TOKEN),
  'password reset': (service: NoopEmailService) => service.sendPasswordResetEmail(EMAIL, TOKEN),
}

describe('NoopEmailService logging (spec 10, Sécurité › Logs)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  describe.each(Object.entries(sends))('%s email', (_, send) => {
    it('never logs the recipient address, outside production', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      await send(new NoopEmailService())
      expect(everythingLogged()).not.toContain(EMAIL)
      expect(everythingLogged()).not.toContain('alice')
    })

    it('logs the token outside production so local activation/reset keeps working', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      await send(new NoopEmailService())
      expect(everythingLogged()).toContain(TOKEN)
    })

    it('also logs the token under test (NODE_ENV=test)', async () => {
      vi.stubEnv('NODE_ENV', 'test')
      await send(new NoopEmailService())
      expect(everythingLogged()).toContain(TOKEN)
    })

    it('logs neither the token nor the recipient in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      await send(new NoopEmailService())
      expect(everythingLogged()).not.toContain(TOKEN)
      expect(everythingLogged()).not.toContain(EMAIL)
    })

    it('still tells operators in production that no email was sent', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      await send(new NoopEmailService())
      expect(logger.warn).toHaveBeenCalledTimes(1)
    })
  })
})
