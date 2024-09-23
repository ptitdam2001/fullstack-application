import { createContext, ReactNode, useContext } from 'react'

import { useAuth } from './useAuth'

const noProvider = Symbol('no provider')

type AuthContextType = ReturnType<typeof useAuth>

const AuthContext = createContext<AuthContextType | typeof noProvider>(noProvider)
AuthContext.displayName = 'AuthContextProvider'

export const useAuthContext = () => {
  const value = useContext(AuthContext)

  if (value === noProvider) {
    throw new Error('useAuth is used outside of AuthProvider')
  }

  return value
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = useAuth()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
