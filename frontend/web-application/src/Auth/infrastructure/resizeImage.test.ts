import { afterEach, describe, expect, it, vi } from 'vitest'
import { computeSquareCrop, resizeImageToJpegBase64, stripDataUrlPrefix } from './resizeImage'

describe('computeSquareCrop', () => {
  it('center-crops a landscape picture', () => {
    expect(computeSquareCrop(1000, 600, 256)).toEqual({ sx: 200, sy: 0, side: 600, size: 256 })
  })

  it('center-crops a portrait picture', () => {
    expect(computeSquareCrop(600, 1000, 256)).toEqual({ sx: 0, sy: 200, side: 600, size: 256 })
  })

  it('keeps a square picture whole', () => {
    expect(computeSquareCrop(512, 512, 256)).toEqual({ sx: 0, sy: 0, side: 512, size: 256 })
  })

  it('never upscales a picture smaller than the target', () => {
    expect(computeSquareCrop(120, 100, 256)).toEqual({ sx: 10, sy: 0, side: 100, size: 100 })
  })
})

describe('stripDataUrlPrefix', () => {
  it('removes the data url prefix', () => {
    expect(stripDataUrlPrefix('data:image/jpeg;base64,/9j/4AAQ')).toBe('/9j/4AAQ')
  })
})

// jsdom has no real canvas nor createImageBitmap: both are stubbed to check the drawing contract
describe('resizeImageToJpegBase64', () => {
  const close = vi.fn()
  const context = { fillStyle: '', imageSmoothingQuality: '', fillRect: vi.fn(), drawImage: vi.fn() }

  const stubBrowser = ({ dataUrl = 'data:image/jpeg;base64,RkFLRQ==', width = 1000, height = 600 } = {}) => {
    const bitmap = { width, height, close }
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap))
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(dataUrl)
    return { bitmap, toDataURL }
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('draws the centered square on a 256 × 256 canvas and returns base64 without the data url prefix', async () => {
    const { bitmap, toDataURL } = stubBrowser()

    const result = await resizeImageToJpegBase64(new Blob(['x'], { type: 'image/png' }))

    expect(result).toBe('RkFLRQ==')
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 256, 256)
    expect(context.drawImage).toHaveBeenCalledWith(bitmap, 200, 0, 600, 600, 0, 0, 256, 256)
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg', 0.85)
    expect(close).toHaveBeenCalledOnce()
  })

  it('rejects when the browser cannot encode JPEG', async () => {
    stubBrowser({ dataUrl: 'data:image/png;base64,AAAA' })

    await expect(resizeImageToJpegBase64(new Blob(['x']))).rejects.toThrow(/JPEG/)
    expect(close).toHaveBeenCalledOnce()
  })

  it('rejects when the file is not a decodable picture', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('not an image')))

    await expect(resizeImageToJpegBase64(new Blob(['x']))).rejects.toThrow('not an image')
  })
})
