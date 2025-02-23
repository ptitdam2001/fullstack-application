import React, { ReactNode, useReducer } from 'react'

const noProvider = Symbol('no provider')

type TableCellType = {
  id: string
  size: string
}

type TableContextType = {
  cells: TableCellType[]
}

const tableContext = React.createContext<TableContextType | typeof noProvider>(noProvider)
tableContext.displayName = 'tableContext'

const tableDispatchContext = React.createContext<React.Dispatch<TableReducerAtion> | typeof noProvider>(noProvider)
tableDispatchContext.displayName = 'tableDispatchContext'

const useTableValue = () => {
  const value = React.useContext(tableContext)

  if (value === noProvider) {
    throw new Error(`useTableValue is used outside of its TableProvider`)
  }

  return value
}

const useTableDispatch = () => {
  const value = React.useContext(tableDispatchContext)

  if (value === noProvider) {
    throw new Error(`useTableColsCountDispatch is used outside of its TableProvider`)
  }

  return value
}

type TableReducerAtion = {
  action: 'add' | 'remove'
  payload: TableCellType
}
const tableReducer = (currentState: TableContextType, newState: TableReducerAtion) => {
  const { payload, action } = newState

  switch (action) {
    case 'add': {
      return { cells: [...currentState.cells, payload] }
    }
    case 'remove': {
      return { cells: currentState.cells.filter(elt => elt.id !== payload.id) }
    }
    default: {
      return currentState
    }
  }
}

type TableProviderProps = {
  children: ReactNode
}

export const TableProvider = {
  Provider: ({ children }: TableProviderProps) => {
    const [value, dispatch] = useReducer(tableReducer, { cells: [] })

    return (
      <tableContext.Provider value={value}>
        <tableDispatchContext.Provider value={dispatch}>{children}</tableDispatchContext.Provider>
      </tableContext.Provider>
    )
  },
  useTableValue,
  useTableDispatch,
}
