import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { FC, ReactNode } from 'react'
import { GlobalCssPriority } from './GlobalCssPriority'

import { purple } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
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
  <MuiThemeProvider theme={theme}>
    <GlobalCssPriority>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        {children}
      </StyledEngineProvider>
    </GlobalCssPriority>
  </MuiThemeProvider>
)
