import { TabProps } from '@Common/LinkTabs/LinkTab'
import PlaceIcon from '@mui/icons-material/Place'

/**
 * List of Setting menu
 */
const menu = [
  {
    tabIndex: 0,
    label: 'Area',
    href: 'areas',
    icon: <PlaceIcon />,
  },
]

type Output = {
  list: TabProps[]
}

export const useSettingsMenu = (): Output => {
  return {
    list: menu,
  }
}
