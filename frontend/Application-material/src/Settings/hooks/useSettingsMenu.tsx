import { TabProps } from '@Common/LinkTabs/LinkTab'
import PlaceIcon from '@mui/icons-material/Place'

export const useSettingsMenu = (): TabProps[] => {
  return [
    {
      label: 'Area',
      href: 'areas',
      icon: <PlaceIcon />,
      selected: true,
    },
  ]
}
