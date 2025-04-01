import { ReactNode } from 'react'

import { UserWithoutPassword } from '@Sdk/model'
import { createContextWithWrite } from '@Common/Context/createContextWithWrite'
import { useCheckAuthLocalStorage } from './hooks/useCheckAuthLocalStorage'

type AuthData = {
  user?: UserWithoutPassword
  token?: string
}

export const DEFAULT_AUTH_DATA: AuthData = {
  user: undefined,
  token: undefined,
}

const AuthContext = createContextWithWrite<AuthData, AuthData>('Auth')

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = {
  Provider: ({ children }: AuthProviderProps) => {
    const value = useCheckAuthLocalStorage()

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  },
  useAuthValue: AuthContext.useValue,
  useAuthDispatch: AuthContext.useDispatch,
}
