import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { OpenProvider } from '@Providers/OpenProvider'

export const MenuToggleButton = () => {
  const isOpen = OpenProvider.useValue()
  const openDispatch = OpenProvider.useDispatch()

  const handleClick = () => {
    openDispatch(true)
  }

  if (isOpen) {
    return null
  }

  return (
    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClick}>
      <MenuIcon />
    </IconButton>
  )
}
