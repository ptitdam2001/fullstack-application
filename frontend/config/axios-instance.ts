/**
 * This file is used during sdk code generation.
 *
 * @see https://orval.dev/guides/custom-axios
 */
import Axios, { AxiosRequestConfig } from 'axios'

// const getBaseUrl = () => import.meta.env.BACKEND_BASEURL
const getBaseUrl = () => 'http://localhost:3000/'

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

/**
 * Create custom Axios instance with credentials/cookie handled.
 */
export const customAxiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()

  return AXIOS_INSTANCE({
    ...getAxiosConfig(),
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)
}
