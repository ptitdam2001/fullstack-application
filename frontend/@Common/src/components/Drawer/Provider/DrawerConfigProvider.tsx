import { createContext, ProviderProps, useContext } from 'react'
import { DrawerContainerProps } from '../Container/DrawerContainer'

const noProvider = Symbol('no provider')

export type DrawerConfigType = Omit<DrawerContainerProps, 'children'>

const context = createContext<DrawerConfigType | typeof noProvider>(noProvider)
context.displayName = 'DrawerConfig'

const useDrawerConfig = () => {
  const value = useContext(context)

  if (value === noProvider) {
    throw new Error(`useDrawerConfig is used outside of its DrawerConfigProvider`)
  }

  return value
}

type DrawerConfigProviderProps = ProviderProps<DrawerConfigType>

export const DrawerConfigProvider = {
  Provider: ({ children, value }: DrawerConfigProviderProps) => (
    <context.Provider value={value}>{children}</context.Provider>
  ),
  useDrawerConfig,
}
