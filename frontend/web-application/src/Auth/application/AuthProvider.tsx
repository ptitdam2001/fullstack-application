import { type ReactNode } from 'react'
import { createContextWithWrite } from '@repo/design-system'
import { type AuthData } from '../domain/Auth'
import { useCheckAuth } from './useCheckAuth'

const AuthContext = createContextWithWrite<AuthData, AuthData>('Auth')

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = {
  Provider: ({ children }: AuthProviderProps) => {
    const value = useCheckAuth()
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  },
  useAuthValue: AuthContext.useValue,
  useAuthDispatch: AuthContext.useDispatch,
}
