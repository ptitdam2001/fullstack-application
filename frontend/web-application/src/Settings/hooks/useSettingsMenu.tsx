import { TabProps } from '@Common/LinkTabs/LinkTab'
import { MapPinHouse } from 'lucide-react'

/**
 * List of Setting menu
 */
const menu = [
  {
    tabIndex: 'areas',
    label: 'Area',
    href: 'areas',
    icon: <MapPinHouse />,
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
