import { graphqlRequestClient, useGetMeQuery } from '@Api';

export const useCurrentUser = () => {
  const { data, refetch, error, isFetching} = useGetMeQuery(graphqlRequestClient)

  return {
    user: data?.getMe?.user,
    fetching: isFetching,
    error,
    refetch,
  }
}
