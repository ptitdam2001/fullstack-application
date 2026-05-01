import type { ReactNode } from 'react'

export const FormattedMessage = ({ id }: { id: string }) => <>{id}</>

export const useIntl = () => ({
  formatMessage: ({ id }: { id: string }) => id,
})

export const IntlProvider = ({ children }: { children: ReactNode }) => <>{children}</>
