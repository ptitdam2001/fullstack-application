import { createContext, ReactNode, useContext } from 'react'

import { useAuth } from './useAuth'

const noProvider = Symbol('no provider')

type AuthContextType = ReturnType<typeof useAuth>

const AuthContext = createContext<AuthContextType | typeof noProvider>(noProvider)
AuthContext.displayName = 'AuthContextProvider'

const useAuthValue = () => {
  const value = useContext(AuthContext)

  if (value === noProvider) {
    throw new Error('useAuthValue is used outside of AuthProvider')
  }

  return value
}

type AuthProviderProps = {
  children: ReactNode
}

export const Auth = {
  Provider: ({ children }: AuthProviderProps) => {
    const value = useAuth()

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  },
  useAuthValue,
}
