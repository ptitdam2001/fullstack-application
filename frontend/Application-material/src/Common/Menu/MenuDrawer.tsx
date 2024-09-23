import { Divider, IconButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { OpenProvider } from '@Providers/OpenProvider'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { styled, useTheme } from '@mui/material/styles'
import { FC, ReactNode } from 'react'

const DRAWER_WIDTH = 240

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

type MenuDrawerProps = {
  children: ReactNode
  width?: string
}

export const MenuDrawer: FC<MenuDrawerProps> = ({ children, width = DRAWER_WIDTH }) => {
  const theme = useTheme()
  const open = OpenProvider.useOpenValue()
  const dispatch = OpenProvider.useOpenDispatch()

  const handleClose = () => {
    dispatch(false)
  }

  return (
    <Drawer
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {children}
    </Drawer>
  )
}
