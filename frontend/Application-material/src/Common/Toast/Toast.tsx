import { createContextWithWrite } from '@Common/Context/createContextWithWrite'
import { Snackbar, SnackbarOrigin } from '@mui/material'
import React from 'react'

type ToastOptionsType = {
  open: boolean
  message: React.ReactNode
  position?: SnackbarOrigin
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

// eslint-disable-next-line react-refresh/only-export-components
const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const value = ToastContext.useValue()
  const dispatch = ToastContext.useDispatch()

  const handleClose = () => {
    dispatch({ ...value, open: false })
  }

  return (
    <>
      {children}
      <Snackbar anchorOrigin={value.position} open={value.open} onClose={handleClose} message={value.message} />
    </>
  )
}

const ToastContext = createContextWithWrite<ToastOptionsType, Partial<ToastOptionsType>>(
  'Toast',
  reducer,
  ToastContainer
)

type ToastProviderProps = {
  children: React.ReactNode
  value?: ToastOptionsType
}

export default {
  Provider: ({ children, value = defaultToastState }: ToastProviderProps) => (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  ),
  useToast: () => {
    const dispatch = ToastContext.useDispatch()
    return (options: Omit<ToastOptionsType, 'open'>) => {
      dispatch({ ...options, open: true })
    }
  },
}
