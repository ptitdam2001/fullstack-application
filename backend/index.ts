import dotenv from 'dotenv'

import { createApp } from './createApp'
import { logger } from './config/logger'
import { prisma } from './utils/prismaClient'

// configures dotenv to work in your application
dotenv.config()

const PORT = process.env.PORT

const start = async () => {
  await prisma.$connect()
  logger.info('Database connected')

  const app = await createApp()
  app
    .listen(PORT, () => {
      logger.info('Server running at PORT: %d', PORT)
    })
    .on('error', error => {
      throw new Error(error.message)
    })
}

start().catch(error => {
  logger.error('Failed to connect to database: %s', error.message)
  process.exit(1)
})