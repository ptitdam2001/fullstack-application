/**
 * This file is used during sdk code generation.
 *
 * @see https://orval.dev/guides/custom-axios
 */
import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { clearAuthStorage } from '@Auth/authStorage'
import { redirectToLogin } from '@Auth/authNavigation'

// const getBaseUrl = () => import.meta.env.BACKEND_BASEURL
const getBaseUrl = () => 'http://localhost:4000/'

const getAxiosConfig = (): AxiosRequestConfig => {
  const localstorageContent = localStorage.getItem('user')
  const userInfo = JSON.parse(localstorageContent ?? '{}')

  return {
    baseURL: getBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${userInfo?.token}`,
    },
  }
}

const AXIOS_INSTANCE = Axios.create()

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthStorage()
      redirectToLogin()
    }
    return Promise.reject(error)
  }
)

/**
 * Create custom Axios instance with credentials/cookie handled.
 */
export const customAxiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()
  const baseRequestConfig = getAxiosConfig()

  const requestConfig = {
    ...baseRequestConfig,
    ...config,
    ...options,
    headers: {
      ...baseRequestConfig.headers,
      ...config.headers,
    },
    cancelToken: source.token,
  }

  return AXIOS_INSTANCE(requestConfig).then(({ data }) => data)
}
