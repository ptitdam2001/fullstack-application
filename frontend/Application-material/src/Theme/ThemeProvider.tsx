import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { FC, ReactNode } from 'react'
import { GlobalCssPriority } from './GlobalCssPriority'

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  components: {
    MuiPopover: {
      defaultProps: {},
    },
    MuiPopper: {
      defaultProps: {},
    },
    MuiDialog: {
      defaultProps: {},
    },
    MuiModal: {
      defaultProps: {},
    },
  },
})

type Props = {
  children: ReactNode
}

export const ThemeProvider: FC<Props> = ({ children }) => (
  <GlobalCssPriority>
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  </GlobalCssPriority>
)
