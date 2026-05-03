import React from 'react'
import { toast, Toaster, type ToasterProps, type ExternalToast } from 'sonner'
import { useTheme } from 'next-themes'

type ToastFn = {
  (message: React.ReactNode, options?: ExternalToast): string | number
  success(message: React.ReactNode, options?: ExternalToast): string | number
  error(message: React.ReactNode, options?: ExternalToast): string | number
  warning(message: React.ReactNode, options?: ExternalToast): string | number
  loading(message: React.ReactNode, options?: ExternalToast): string | number
  dismiss(id?: string | number): void
}
import { createContextWithWrite } from '../../contexts/createContextWithWrite'

type ToastOptionsType = {
  position?: ToasterProps['position']
}

const reducer = (currentState: ToastOptionsType, newState: Partial<ToastOptionsType>) => ({
  ...currentState,
  ...newState,
})

const defaultToastState: ToastOptionsType = {
  position: 'bottom-left',
}

// eslint-disable-next-line react-refresh/only-export-components
const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const value = ToastContext.useValue()
  const { theme = 'system' } = useTheme()

  return (
    <>
      {children}
      <Toaster
        theme={theme as ToasterProps['theme']}
        position={value.position ?? 'bottom-left'}
        className="toaster group"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
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

export const Toast = {
  Provider: ({ children, value = defaultToastState }: ToastProviderProps) => (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  ),
  useToast: (): ToastFn => toast as ToastFn,
}
