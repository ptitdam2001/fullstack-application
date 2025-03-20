import React from 'react'

const noProvider = Symbol('no provider')

type TabContextType = {
  currentIndex: number
}

const tabContext = React.createContext<TabContextType | typeof noProvider>(noProvider)
tabContext.displayName = 'tabContext'

const tabDispatchContext = React.createContext<React.Dispatch<TabContextType> | typeof noProvider>(noProvider)
tabDispatchContext.displayName = 'tableDispatchContext'

const useTabValue = () => {
  const value = React.useContext(tabContext)

  if (value === noProvider) {
    throw new Error(`useTabValue is used outside of its TabProvider`)
  }

  return value
}

const useTabDispatch = () => {
  const value = React.useContext(tabDispatchContext)

  if (value === noProvider) {
    throw new Error(`useTabDispatch is used outside of its TabProvider`)
  }

  return value
}

export const TabContext = {
  Provider: ({ children, value: defaultValue }: React.ProviderProps<TabContextType>) => {
    const [value, setValue] = React.useState(defaultValue)

    return (
      <tabContext.Provider value={value}>
        <tabDispatchContext.Provider value={setValue}>{children}</tabDispatchContext.Provider>
      </tabContext.Provider>
    )
  },
  useTabValue,
  useTabDispatch,
}
