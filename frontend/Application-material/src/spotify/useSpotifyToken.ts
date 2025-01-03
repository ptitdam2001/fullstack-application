import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../config/dexie"

export const useSpotifyToken = (): string => {
  const token = useLiveQuery(() => db.spotify.get({ id: 1 }))
  return token?.token ?? ''
}
