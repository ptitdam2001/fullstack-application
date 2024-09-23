import { AppBar, AppBarProps, Toolbar, Typography } from '@mui/material'
import { ToggleThemeMode } from '@Theme/ToggleThemeMode'
import { FC, ReactNode } from 'react'
import { AuthActions } from '@Auth/AuthActions'

type TopBarProps = {
  title: ReactNode
  leftContent?: ReactNode
} & Pick<AppBarProps, 'position'>

export const TopBar: FC<TopBarProps> = ({ title, leftContent, position = 'static' }) => (
  <AppBar position={position}>
    <Toolbar>
      {leftContent}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      <div className="flex gap-2">
        <ToggleThemeMode />
        <AuthActions />
      </div>
    </Toolbar>
  </AppBar>
)
