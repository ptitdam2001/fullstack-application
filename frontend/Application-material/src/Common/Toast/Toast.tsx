import { Snackbar, SnackbarOrigin } from '@mui/material'
import React from 'react'

const noProvider = Symbol('no toast provider')

type ToastOptionsType = {
  open: boolean
  message: React.ReactNode
  position?: SnackbarOrigin
}

const toastContext = React.createContext<ToastOptionsType | typeof noProvider>(noProvider)
toastContext.displayName = 'toastContext'

const toastDispatchContext = React.createContext<React.Dispatch<Partial<ToastOptionsType>> | typeof noProvider>(
  noProvider
)
toastDispatchContext.displayName = 'toastDispatchContext'

const useToastDispatch = () => {
  const value = React.useContext(toastDispatchContext)

  if (value === noProvider) {
    throw new Error(`useTableDispatch is used outside of its TableProvider`)
  }

  return value
}

const reducer = (currentState: ToastOptionsType, newState: Partial<ToastOptionsType>) => ({
  ...currentState,
  ...newState,
})
const defaultToastState: ToastOptionsType = {
  open: false,
  message: '',
  position: { horizontal: 'left', vertical: 'bottom' },
}

type ToastProviderProps = {
  children: React.ReactNode
}

export default {
  Provider: ({ children }: ToastProviderProps) => {
    const [value, dispatch] = React.useReducer(reducer, defaultToastState)

    const handleClose = () => {
      dispatch(defaultToastState)
    }

    return (
      <toastContext.Provider value={value}>
        <toastDispatchContext.Provider value={dispatch}>
          {children}
          <Snackbar anchorOrigin={value.position} open={value.open} onClose={handleClose} message={value.message} />
        </toastDispatchContext.Provider>
      </toastContext.Provider>
    )
  },
  useToast: () => {
    const dispatch = useToastDispatch()
    return (options: Omit<ToastOptionsType, 'open'>) => {
      dispatch({ ...options, open: true })
    }
  },
}
