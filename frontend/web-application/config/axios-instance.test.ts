import { type AxiosAdapter, AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAuthStorage } from '@Auth/infrastructure/authStorage'
import { redirectToLogin } from '@Auth/infrastructure/authNavigation'
import { customAxiosInstance } from './axios-instance'

vi.mock('@Auth/infrastructure/authStorage', () => ({ clearAuthStorage: vi.fn() }))
vi.mock('@Auth/infrastructure/authNavigation', () => ({ redirectToLogin: vi.fn() }))

// Answers every request with a 401, as the API does for an expired session or wrong credentials
const unauthorized: AxiosAdapter = async config => {
  const request = config as InternalAxiosRequestConfig
  throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', request, null, {
    status: 401,
    statusText: 'Unauthorized',
    data: { status: 401, message: 'Unauthorized' },
    headers: {},
    config: request,
  })
}

describe('customAxiosInstance — 401 interceptor', () => {
  beforeEach(() => {
    vi.mocked(clearAuthStorage).mockClear()
    vi.mocked(redirectToLogin).mockClear()
  })

  it('signs the user out when an authenticated call answers 401 (session expired)', async () => {
    await expect(customAxiosInstance({ url: '/me', method: 'GET', adapter: unauthorized })).rejects.toThrow()

    expect(clearAuthStorage).toHaveBeenCalledOnce()
    expect(redirectToLogin).toHaveBeenCalledOnce()
  })

  it('leaves a failed sign-in to the form: no sign-out, no reload of the login page', async () => {
    await expect(
      customAxiosInstance({ url: '/login', method: 'POST', data: {}, adapter: unauthorized })
    ).rejects.toMatchObject({ response: { status: 401 } })

    expect(clearAuthStorage).not.toHaveBeenCalled()
    expect(redirectToLogin).not.toHaveBeenCalled()
  })
})
