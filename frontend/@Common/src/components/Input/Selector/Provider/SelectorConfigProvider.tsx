import { createContext, ProviderProps, useContext } from 'react'
import { OptionValueType } from '../types'

const noProvider = Symbol('no provider')

export type SelectorConfigType = {
  onChange?: (selectedValues: OptionValueType[]) => void
  disabled?: boolean
}

const context = createContext<SelectorConfigType | typeof noProvider>(noProvider)
context.displayName = 'SelectorConfig'

export const useSelectorConfig = () => {
  const value = useContext(context)

  if (value === noProvider) {
    throw new Error(`useSelectorConfig is used outside of its SelectorConfigProvider`)
  }

  return value
}

type SelectorConfigProviderProps = ProviderProps<SelectorConfigType>

export const SelectorConfigProvider = ({ children, value }: SelectorConfigProviderProps) => (
  <context.Provider value={value}>{children}</context.Provider>
)
