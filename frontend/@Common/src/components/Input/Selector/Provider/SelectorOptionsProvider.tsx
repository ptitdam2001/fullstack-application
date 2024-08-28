import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { OptionValueType } from '../types'

const noProvider = Symbol('no provider')

export type SelectorOptionStructure = {
  selected: boolean
}

export type SelectorOptionType = Record<OptionValueType, SelectorOptionStructure>

const valueContext = createContext<SelectorOptionType | typeof noProvider>(noProvider)
valueContext.displayName = 'valueContext'

const valueDispatchContext = createContext<Dispatch<SetStateAction<SelectorOptionType>> | typeof noProvider>(noProvider)
valueDispatchContext.displayName = 'valueDispatchContext'

export const useSelectorOptions = () => {
  const value = useContext(valueContext)

  if (value === noProvider) {
    throw new Error(`useSelectorOptions is used outside of its SelectorConfigProvider`)
  }

  return value
}

export const useSelectorOptionsDispatch = () => {
  const value = useContext(valueDispatchContext)

  if (value === noProvider) {
    throw new Error(`useSelectorOptionsDispatch is used outside of its SelectorOptionsProvider`)
  }

  return value
}

type SelectorOptionsProviderProps = PropsWithChildren<unknown>

export const SelectorOptionsProvider = ({ children }: SelectorOptionsProviderProps) => {
  const [options, setOptions] = useState<SelectorOptionType>({})

  return (
    <valueContext.Provider value={options}>
      <valueDispatchContext.Provider value={setOptions}>{children}</valueDispatchContext.Provider>
    </valueContext.Provider>
  )
}
