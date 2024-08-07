import { graphqlRequestClient, useGetMeQuery } from '@Api'

export const useCurrentUser = () => {
  const { data, refetch, error, isFetching, isLoading } = useGetMeQuery(graphqlRequestClient)

  return {
    user: data?.getMe?.user,
    fetching: isFetching,
    isLoading,
    error,
    refetch,
  }
}
