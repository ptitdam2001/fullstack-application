import { createContextWithWrite } from '@Common/Context/createContextWithWrite'

type TableCellType = {
  id: string
  size: string
}

type TableContextType = {
  cells: TableCellType[]
}

type TableReducerAction = {
  action: 'add' | 'remove'
  payload: TableCellType
}
const tableReducer = (currentState: TableContextType, newState: TableReducerAction) => {
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

export const TableProvider = createContextWithWrite<TableContextType, TableReducerAction>('Table', tableReducer)
