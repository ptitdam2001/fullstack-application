import { createContext, Dispatch, ProviderProps, SetStateAction, useContext, useState } from 'react'

const noProvider = Symbol('no provider')

const openContext = createContext<boolean | typeof noProvider>(noProvider)
openContext.displayName = 'openContext'

const openDispatchContext = createContext<Dispatch<SetStateAction<boolean>> | typeof noProvider>(noProvider)
openDispatchContext.displayName = 'openDispatchContext'

const useOpenValue = () => {
  const value = useContext(openContext)

  if (value === noProvider) {
    throw new Error(`useOpenValue is used outside of its OpenProvider`)
  }

  return value
}

const useOpenDispatch = () => {
  const value = useContext(openDispatchContext)

  if (value === noProvider) {
    throw new Error(`useOpenDispatch is used outside of its OpenProvider`)
  }

  return value
}

type SelectorOptionsProviderProps = ProviderProps<boolean>

export const OpenProvider = {
  Provider: ({ children, value }: SelectorOptionsProviderProps) => {
    const [open, setOpen] = useState<boolean>(value)

    return (
      <openContext.Provider value={open}>
        <openDispatchContext.Provider value={setOpen}>{children}</openDispatchContext.Provider>
      </openContext.Provider>
    )
  },
  useOpenValue,
  useOpenDispatch,
}
