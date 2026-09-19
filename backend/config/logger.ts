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

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.splat(), colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
})
