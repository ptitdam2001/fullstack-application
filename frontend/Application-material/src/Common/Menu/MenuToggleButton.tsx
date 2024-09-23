import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { OpenProvider } from '@Providers/OpenProvider'

export const MenuToggleButton = () => {
  const isOpen = OpenProvider.useOpenValue()
  const openDispatch = OpenProvider.useOpenDispatch()

  const handleClick = () => {
    openDispatch(oldValue => !oldValue)
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
