import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSpotifyToken } from './useSpotifyToken';

type UseSpotifyAxiosInstanceOutput<T> = (
  config: AxiosRequestConfig,
) => Promise<T>

export const AXIOS_INSTANCE = Axios.create({ baseURL: 'https://api.spotify.com/v1' });

export const useSpotifyAxiosInstance = <T> (): UseSpotifyAxiosInstanceOutput<T> => {
  const token = useSpotifyToken();

  return (config: AxiosRequestConfig) => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      headers: {
        Authorization: `Bearer ${token}`
      },
      cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-expect-error not
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query');
    };

    return promise;
  };
};

export default useSpotifyAxiosInstance;

export type ErrorType<Error> = AxiosError<Error>;
