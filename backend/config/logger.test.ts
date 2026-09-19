import { Writable } from 'node:stream'
import winston from 'winston'
import { describe, expect, it } from 'vitest'
import { logFormat } from './logger'

const EMAIL = 'alice.dupont@example.com'
const PASSWORD_HASH = '$2b$10$abcdefghijklmnopqrstuuAbCdEfGhIjKlMnOpQrStUvWxYz0123'

const capture = () => {
  const lines: string[] = []
  const stream = new Writable({
    write(chunk, _encoding, done) {
      lines.push(chunk.toString())
      done()
    },
  })
  const log = winston.createLogger({ format: logFormat, transports: [new winston.transports.Stream({ stream })] })
  return { log, output: () => lines.join('') }
}

// Same shape as a real Prisma error: the message embeds the invocation arguments.
class PrismaClientKnownRequestError extends Error {
  code = 'P2002'
  meta = { modelName: 'User', target: ['email'] }
  constructor() {
    super(
      `Invalid \`prisma.user.create()\` invocation:\n\n{\n  data: {\n    email: "${EMAIL}",\n    password: "${PASSWORD_HASH}"\n  }\n}\n\nUnique constraint failed on the fields: (\`email\`)`
    )
    this.name = 'PrismaClientKnownRequestError'
  }
}

describe('logger error sanitising (spec 10, Sécurité › Logs)', () => {
  it('never writes the message of a Prisma error (it embeds the request data)', () => {
    const { log, output } = capture()
    log.error(new PrismaClientKnownRequestError())
    expect(output()).not.toContain(EMAIL)
    expect(output()).not.toContain(PASSWORD_HASH)
    expect(output()).not.toContain('invocation')
  })

  it('keeps what is needed to debug: name, Prisma code, model, field names', () => {
    const { log, output } = capture()
    log.error(new PrismaClientKnownRequestError())
    expect(output()).toContain('PrismaClientKnownRequestError')
    expect(output()).toContain('P2002')
    expect(output()).toContain('User')
    expect(output()).toContain('email')
  })

  it('keeps the stack frames but not the message line', () => {
    const { log, output } = capture()
    log.error(new PrismaClientKnownRequestError())
    expect(output()).toMatch(/\n\s+at .*logger\.test/)
  })

  it('drops the message of any error, not only Prisma ones', () => {
    const { log, output } = capture()
    log.error(new SyntaxError(`Unexpected token 'a', "{"email":"${EMAIL}"" is not valid JSON`))
    expect(output()).toContain('SyntaxError')
    expect(output()).not.toContain(EMAIL)
  })

  it('handles an error without stack, code or meta', () => {
    const { log, output } = capture()
    const error = new Error('contains alice.dupont@example.com')
    delete error.stack
    log.error(error)
    expect(output()).toContain('Error')
    expect(output()).not.toContain(EMAIL)
  })

  it('leaves ordinary string logs untouched', () => {
    const { log, output } = capture()
    log.info('Server running at PORT: %d', 3000)
    log.warn('[NOOP] activation email not sent: no email provider configured')
    expect(output()).toContain('Server running at PORT: 3000')
    expect(output()).toContain('[NOOP] activation email not sent: no email provider configured')
  })

  it('still logs errors at the error level', () => {
    const { log, output } = capture()
    log.error(new PrismaClientKnownRequestError())
    expect(output()).toContain('error')
  })
})
