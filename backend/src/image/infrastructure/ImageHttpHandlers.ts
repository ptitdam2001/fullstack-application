import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { ImageUseCases } from '../application/ImageUseCases.js'
import { ImageNotFoundError } from '../domain/ImageErrors.js'
import { PrismaImageStorage } from './PrismaImageStorage.js'
import { logger } from '../../../config/logger.js'

const useCases = new ImageUseCases(new PrismaImageStorage())

// An image never changes once stored (a new upload gets a new id), so it can be cached for good.
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60
const CACHE_CONTROL = `public, max-age=${ONE_YEAR_SECONDS}, immutable`

export const getImage = async (ctx: Context, _: Request, res: Response) => {
  try {
    const image = await useCases.getById(ctx.request.params.id as string)
    return res
      .status(200)
      .set({
        'Content-Type': image.contentType,
        'Cache-Control': CACHE_CONTROL,
        'X-Content-Type-Options': 'nosniff',
        // helmet defaults to `same-origin`, which makes a browser block an <img> whose page is served
        // from another origin than the API (the web application). These images are public.
        'Cross-Origin-Resource-Policy': 'cross-origin',
      })
      .send(Buffer.from(image.data))
  } catch (err) {
    if (err instanceof ImageNotFoundError) {
      return res.status(404).json({ message: 'Image not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
