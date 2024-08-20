import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

export type SelectorGroupStructure = string[]

const groupContext = createContext<SelectorGroupStructure | undefined>(undefined)
groupContext.displayName = 'groupContext'

export const useSelectorGroup = () => {
  return useContext(groupContext)
}

const groupDispatchContext = createContext<Dispatch<SetStateAction<SelectorGroupStructure>> | undefined>(undefined)
groupDispatchContext.displayName = 'groupDispatchContext'

export const useSelectorGroupDispatch = () => {
  return useContext(groupDispatchContext)
}

type SelectorGroupProviderProps = {
  children: ReactNode
}
export const SelectorGroupProvider = ({ children }: SelectorGroupProviderProps) => {
  const [childOptionIds, setChildOptionIds] = useState<SelectorGroupStructure>([])

  return (
    <groupContext.Provider value={childOptionIds}>
      <groupDispatchContext.Provider value={setChildOptionIds}>{children}</groupDispatchContext.Provider>
    </groupContext.Provider>
  )
}
