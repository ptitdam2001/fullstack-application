/* eslint-disable */
import { GraphQLClient } from 'graphql-request'
import { RequestInit } from 'graphql-request/dist/types.dom'
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit['headers']
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    })
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type EmailInput = {
  email?: InputMaybe<Scalars['String']['input']>
}

export type LoginInput = {
  login?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
}

export type LoginOutput = {
  __typename?: 'LoginOutput'
  access_token?: Maybe<Scalars['String']['output']>
  status?: Maybe<Scalars['String']['output']>
}

export type LogoutUser = {
  __typename?: 'LogoutUser'
  status?: Maybe<Scalars['String']['output']>
}

export type Mutation = {
  __typename?: 'Mutation'
  _empty?: Maybe<Scalars['String']['output']>
  loginUser?: Maybe<LoginOutput>
  resetPassword?: Maybe<PublicTokenOutput>
}

export type MutationLoginUserArgs = {
  inputs?: InputMaybe<LoginInput>
}

export type MutationResetPasswordArgs = {
  inputs?: InputMaybe<EmailInput>
}

export type PublicTokenOutput = {
  __typename?: 'PublicTokenOutput'
  sessionId?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  getMe?: Maybe<GetMeOutput>
  logoutUser?: Maybe<LogoutUser>
  refreshAccessToken?: Maybe<RefreshAccessToken>
}

export type QueryGetMeArgs = {
  input?: InputMaybe<LoginInput>
}

export type RefreshAccessToken = {
  __typename?: 'RefreshAccessToken'
  access_token?: Maybe<Scalars['String']['output']>
  status?: Maybe<Scalars['String']['output']>
}

export type User = {
  __typename?: 'User'
  createdAt?: Maybe<Scalars['Int']['output']>
  email?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  photo?: Maybe<Scalars['String']['output']>
  role?: Maybe<Scalars['String']['output']>
  updatedAt?: Maybe<Scalars['Int']['output']>
}

export type GetMeOutput = {
  __typename?: 'getMeOutput'
  status?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = {
  __typename?: 'Query'
  getMe?: {
    __typename?: 'getMeOutput'
    status?: string | null
    user?: {
      __typename?: 'User'
      id?: string | null
      email?: string | null
      name?: string | null
      role?: string | null
      photo?: string | null
      updatedAt?: number | null
      createdAt?: number | null
    } | null
  } | null
}

export type LogoutUserQueryVariables = Exact<{ [key: string]: never }>

export type LogoutUserQuery = {
  __typename?: 'Query'
  logoutUser?: { __typename?: 'LogoutUser'; status?: string | null } | null
}

export type RefreshAccessTokenQueryVariables = Exact<{ [key: string]: never }>

export type RefreshAccessTokenQuery = {
  __typename?: 'Query'
  refreshAccessToken?: {
    __typename?: 'RefreshAccessToken'
    status?: string | null
    access_token?: string | null
  } | null
}

export type ResetPasswordMutationVariables = Exact<{
  input: EmailInput
}>

export type ResetPasswordMutation = {
  __typename?: 'Mutation'
  resetPassword?: { __typename?: 'PublicTokenOutput'; sessionId?: string | null } | null
}

export type LoginUserMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginUserMutation = {
  __typename?: 'Mutation'
  loginUser?: { __typename?: 'LoginOutput'; status?: string | null; access_token?: string | null } | null
}

export const GetMeDocument = `
    query GetMe {
  getMe {
    status
    user {
      id
      email
      name
      role
      photo
      updatedAt
      createdAt
    }
  }
}
    `

export const useGetMeQuery = <TData = GetMeQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: GetMeQueryVariables,
  options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMeQuery, TError, TData>['queryKey']
  },
  headers?: RequestInit['headers']
) => {
  return useQuery<GetMeQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
    queryFn: fetcher<GetMeQuery, GetMeQueryVariables>(client, GetMeDocument, variables, headers),
    ...options,
  })
}

export const LogoutUserDocument = `
    query LogoutUser {
  logoutUser {
    status
  }
}
    `

export const useLogoutUserQuery = <TData = LogoutUserQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: LogoutUserQueryVariables,
  options?: Omit<UseQueryOptions<LogoutUserQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<LogoutUserQuery, TError, TData>['queryKey']
  },
  headers?: RequestInit['headers']
) => {
  return useQuery<LogoutUserQuery, TError, TData>({
    queryKey: variables === undefined ? ['LogoutUser'] : ['LogoutUser', variables],
    queryFn: fetcher<LogoutUserQuery, LogoutUserQueryVariables>(client, LogoutUserDocument, variables, headers),
    ...options,
  })
}

export const RefreshAccessTokenDocument = `
    query RefreshAccessToken {
  refreshAccessToken {
    status
    access_token
  }
}
    `

export const useRefreshAccessTokenQuery = <TData = RefreshAccessTokenQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: RefreshAccessTokenQueryVariables,
  options?: Omit<UseQueryOptions<RefreshAccessTokenQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<RefreshAccessTokenQuery, TError, TData>['queryKey']
  },
  headers?: RequestInit['headers']
) => {
  return useQuery<RefreshAccessTokenQuery, TError, TData>({
    queryKey: variables === undefined ? ['RefreshAccessToken'] : ['RefreshAccessToken', variables],
    queryFn: fetcher<RefreshAccessTokenQuery, RefreshAccessTokenQueryVariables>(
      client,
      RefreshAccessTokenDocument,
      variables,
      headers
    ),
    ...options,
  })
}

export const ResetPasswordDocument = `
    mutation ResetPassword($input: EmailInput!) {
  resetPassword(inputs: $input) {
    sessionId
  }
}
    `

export const useResetPasswordMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>,
  headers?: RequestInit['headers']
) => {
  return useMutation<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>({
    mutationKey: ['ResetPassword'],
    mutationFn: (variables?: ResetPasswordMutationVariables) =>
      fetcher<ResetPasswordMutation, ResetPasswordMutationVariables>(
        client,
        ResetPasswordDocument,
        variables,
        headers
      )(),
    ...options,
  })
}

export const LoginUserDocument = `
    mutation LoginUser($input: LoginInput!) {
  loginUser(inputs: $input) {
    status
    access_token
  }
}
    `

export const useLoginUserMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<LoginUserMutation, TError, LoginUserMutationVariables, TContext>,
  headers?: RequestInit['headers']
) => {
  return useMutation<LoginUserMutation, TError, LoginUserMutationVariables, TContext>({
    mutationKey: ['LoginUser'],
    mutationFn: (variables?: LoginUserMutationVariables) =>
      fetcher<LoginUserMutation, LoginUserMutationVariables>(client, LoginUserDocument, variables, headers)(),
    ...options,
  })
}
