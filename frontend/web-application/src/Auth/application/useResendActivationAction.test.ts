import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useResendActivationAction } from './useResendActivationAction'

describe('useResendActivationAction', () => {
  it('starts not pending', () => {
    const { result } = renderHookWithProviders(() => useResendActivationAction())
    expect(result.current.isPending).toBe(false)
  })

  it('asks for a new activation link for the email', async () => {
    let body: unknown
    server.use(
      http.post('*/resend-activation', async ({ request }) => {
        body = await request.json()
        return new HttpResponse(null, { status: 204 })
      })
    )
    const { result } = renderHookWithProviders(() => useResendActivationAction())

    await result.current.process('jane@doe.io')

    expect(body).toEqual({ email: 'jane@doe.io' })
  })

  it('throws when the API fails', async () => {
    server.use(http.post('*/resend-activation', () => HttpResponse.json({}, { status: 429 })))
    const { result } = renderHookWithProviders(() => useResendActivationAction())

    await expect(result.current.process('jane@doe.io')).rejects.toThrow()
  })
})
