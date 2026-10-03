import { act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useMyAvatarActions } from './useMyAvatarActions'
import { resizeImageToJpegBase64 } from '../infrastructure/resizeImage'

const mockUpdateUser = vi.fn()

vi.mock('./useAuthSession', () => ({
  useAuthSession: () => ({ updateUser: mockUpdateUser, updateToken: vi.fn() }),
}))

// jsdom has no canvas: the resize step is replaced, its own contract is covered in resizeImage.test.ts
vi.mock('../infrastructure/resizeImage', () => ({
  resizeImageToJpegBase64: vi.fn(),
}))

const png = new File(['binary'], 'me.png', { type: 'image/png' })
const userWithAvatar = { id: 'u1', firstName: 'Jane', avatar: '/images/abc' }

describe('useMyAvatarActions', () => {
  beforeEach(() => {
    vi.mocked(resizeImageToJpegBase64).mockResolvedValue('QkFTRTY0')
  })

  describe('upload', () => {
    it('resizes the file, sends it as base64 JPEG and refreshes the session user', async () => {
      let body: unknown
      server.use(
        http.put('*/me/avatar', async ({ request }) => {
          body = await request.json()
          return HttpResponse.json(userWithAvatar)
        })
      )
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      let saved = false
      await act(async () => {
        saved = await result.current.upload(png)
      })

      expect(saved).toBe(true)
      expect(resizeImageToJpegBase64).toHaveBeenCalledWith(png)
      expect(body).toEqual({ contentType: 'image/jpeg', data: 'QkFTRTY0' })
      expect(mockUpdateUser).toHaveBeenCalledWith(userWithAvatar)
      expect(result.current.error).toBeNull()
    })

    it('rejects a non-image file without calling the API', async () => {
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      let saved = true
      await act(async () => {
        saved = await result.current.upload(new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' }))
      })

      expect(saved).toBe(false)
      expect(result.current.error).toBe('invalidType')
      expect(resizeImageToJpegBase64).not.toHaveBeenCalled()
      expect(mockUpdateUser).not.toHaveBeenCalled()
    })

    it('reports an unreadable picture when the resize step fails', async () => {
      vi.mocked(resizeImageToJpegBase64).mockRejectedValue(new Error('corrupt'))
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      await act(async () => {
        await result.current.upload(png)
      })

      expect(result.current.error).toBe('unreadable')
      expect(result.current.isUploading).toBe(false)
      expect(mockUpdateUser).not.toHaveBeenCalled()
    })

    it.each([
      [400, 'rejected'],
      [500, 'generic'],
    ] as const)('maps a %i answer to the "%s" error', async (status, code) => {
      server.use(http.put('*/me/avatar', () => HttpResponse.json({ message: 'Nope', status }, { status })))
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      await act(async () => {
        await result.current.upload(png)
      })

      await waitFor(() => expect(result.current.error).toBe(code))
      expect(mockUpdateUser).not.toHaveBeenCalled()
    })

    it('clears the previous error on a new attempt', async () => {
      server.use(http.put('*/me/avatar', () => HttpResponse.json(userWithAvatar)))
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      await act(async () => {
        await result.current.upload(new File(['x'], 'a.gif', { type: 'image/gif' }))
      })
      expect(result.current.error).toBe('invalidType')

      await act(async () => {
        await result.current.upload(png)
      })
      expect(result.current.error).toBeNull()
    })
  })

  describe('remove', () => {
    it('sends DELETE /me/avatar and refreshes the session user', async () => {
      let called = false
      server.use(
        http.delete('*/me/avatar', () => {
          called = true
          return HttpResponse.json({ id: 'u1', firstName: 'Jane' })
        })
      )
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      let removed = false
      await act(async () => {
        removed = await result.current.remove()
      })

      expect(removed).toBe(true)
      expect(called).toBe(true)
      expect(mockUpdateUser).toHaveBeenCalledWith({ id: 'u1', firstName: 'Jane' })
    })

    it('reports a generic error when the API fails', async () => {
      server.use(http.delete('*/me/avatar', () => HttpResponse.json({ message: 'Boom', status: 500 }, { status: 500 })))
      const { result } = renderHookWithProviders(() => useMyAvatarActions())

      await act(async () => {
        await result.current.remove()
      })

      await waitFor(() => expect(result.current.error).toBe('generic'))
      expect(mockUpdateUser).not.toHaveBeenCalled()
    })
  })
})
