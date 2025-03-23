import { ReactNode } from 'react'

import { useAuth } from './useAuth'
import { createContextWithRead } from '@Common/Context/createContextWithRead'

type AuthContextType = ReturnType<typeof useAuth>

const AuthContext = createContextWithRead<AuthContextType>('Auth')

type AuthProviderProps = {
  children: ReactNode
}

export const Auth = {
  Provider: ({ children }: AuthProviderProps) => {
    const value = useAuth()

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  },
  useAuthValue: AuthContext.useValue,
}
