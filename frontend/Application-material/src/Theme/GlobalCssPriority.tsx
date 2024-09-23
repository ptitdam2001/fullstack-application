import { StyledEngineProvider } from '@mui/material/styles'
import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const GlobalCssPriority: FC<Props> = ({ children }) => (
  <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
)
