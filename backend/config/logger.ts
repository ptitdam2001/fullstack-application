import chalk, { type ChalkInstance } from 'chalk'
import winston from 'winston'

const levelColors: Record<string, ChalkInstance> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
}

const colorize = winston.format(info => {
  const level = info.level
  const color = levelColors[level] ?? chalk.white
  info.message = color(info.message)
  return info
})

type ErrorWithPrismaDetails = Error & { code?: unknown; meta?: { modelName?: unknown; target?: unknown } }

const STACK_FRAME = /^\s+at /

/**
 * What is safe to log about an error (spec 10, Sécurité › Logs): its name, Prisma code, model and
 * field names, and the stack frames. Never its message: Prisma errors embed the invocation
 * arguments there (create data, where clauses), i.e. emails and password hashes.
 */
const describeError = (error: ErrorWithPrismaDetails): string => {
  const summary = [error.name]
  if (typeof error.code === 'string') {
    summary.push(error.code)
  }
  if (typeof error.meta?.modelName === 'string') {
    summary.push(`model=${error.meta.modelName}`)
  }
  const { target } = error.meta ?? {}
  if (typeof target === 'string' || (Array.isArray(target) && target.every(field => typeof field === 'string'))) {
    summary.push(`fields=${[target].flat().join(',')}`)
  }
  const frames = (error.stack ?? '').split('\n').filter(line => STACK_FRAME.test(line))
  return [summary.join(' '), ...frames].join('\n')
}

// winston hands `logger.error(err)` the Error itself as the log record, so it is rewritten once here
// for every call site.
const redactErrors = winston.format(info => {
  if (!(info instanceof Error)) {
    return info
  }
  const sanitised: winston.Logform.TransformableInfo = { level: info.level, message: describeError(info) }
  for (const symbol of Object.getOwnPropertySymbols(info)) {
    sanitised[symbol] = info[symbol as unknown as keyof typeof info]
  }
  return sanitised
})

export const logFormat = winston.format.combine(
  winston.format.splat(),
  redactErrors(),
  colorize(),
  winston.format.simple()
)

export const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console()],
})
