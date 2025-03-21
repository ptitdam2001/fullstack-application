import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { OpenProvider } from '@Providers/OpenProvider'
import { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router'

export type MenuElt = {
  label: ReactNode
  url: string
  icon: ReactNode
}

type LateralConnectedMenuProps = {
  links: MenuElt[]
}

export const LateralConnectedMenu: FC<LateralConnectedMenuProps> = ({ links }) => {
  const dispatch = OpenProvider.useDispatch()
  const navigate = useNavigate()

  const handleClick = (url: string) => () => {
    navigate(url)
    dispatch(false)
  }

  return (
    <List>
      {links.map(({ label, url, icon }) => (
        <ListItem key={url} disablePadding>
          <ListItemButton onClick={handleClick(url)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
