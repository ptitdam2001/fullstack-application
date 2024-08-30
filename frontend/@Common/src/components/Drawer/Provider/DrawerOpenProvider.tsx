import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { DrawerConfigProvider } from './DrawerConfigProvider'

const noProvider = Symbol('no provider')

const openContext = createContext<boolean | typeof noProvider>(noProvider)
openContext.displayName = 'openContext'

const openDispatchContext = createContext<Dispatch<SetStateAction<boolean>> | typeof noProvider>(noProvider)
openDispatchContext.displayName = 'openDispatchContext'

const useDrawerOpen = () => {
  const value = useContext(openContext)

  if (value === noProvider) {
    throw new Error(`useDrawerOpen is used outside of its DrawerOpenProvider`)
  }

  return value
}

const useDrawerOpenDispatch = () => {
  const value = useContext(openDispatchContext)

  if (value === noProvider) {
    throw new Error(`useDrawerOpenDispatch is used outside of its DrawerOpenProvider`)
  }

  return value
}

type SelectorOptionsProviderProps = PropsWithChildren<unknown>

export const DrawerOpenProvider = {
  Provider: ({ children }: SelectorOptionsProviderProps) => {
    const { opened = false } = DrawerConfigProvider.useDrawerConfig()
    const [open, setOpen] = useState<boolean>(opened)

    return (
      <openContext.Provider value={open}>
        <openDispatchContext.Provider value={setOpen}>{children}</openDispatchContext.Provider>
      </openContext.Provider>
    )
  },
  useDrawerOpen,
  useDrawerOpenDispatch,
}
