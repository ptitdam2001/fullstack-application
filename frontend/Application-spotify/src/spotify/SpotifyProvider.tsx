import Axios from 'axios'
import { PropsWithChildren, useCallback, useEffect } from 'react'
import { db } from '../../config/dexie'
import dayjs from 'dayjs'

type ResponseOutput = {
  access_token: string
  token_type: string
  expires_in: number
}

type SpotifyProviderProps = PropsWithChildren<{
  clientId: string
  clientSecret: string
}>

const TOKEN_INSTANCE = Axios.create({
  baseURL: 'https://accounts.spotify.com/api',
})

export const SpotifyProvider = ({ children, clientId, clientSecret }: SpotifyProviderProps) => {
  const initToken = useCallback(async () => {
    const token = await db.spotify.get(1)

    const isExpired = dayjs(token ? token.expireAt : 0).isBefore(new Date())
    const alreadyExists = Boolean(token)

    // No token in local client storage or date has expired
    if (!token || isExpired) {
      const { data } = await TOKEN_INSTANCE.post<ResponseOutput>(
        'token',
        {},
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )

      if (data) {
        try {
          const toInsert = {
            id: 1,
            token: data.access_token,
            expireAt: dayjs().add(data.expires_in, 'seconds').valueOf(),
          }
          if (alreadyExists) {
            await db.spotify.update(1, toInsert)
          } else {
            await db.spotify.add(toInsert)
          }
        } catch (error) {
          console.error(`Fail to add to local client storage: ${error}`)
        }
      }
    }
  }, [clientId, clientSecret])

  useEffect(() => {
    initToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return children
}
