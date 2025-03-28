import { MenuElt } from '@Layouts/components/LateralConnectedMenu'

import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SettingsIcon from '@mui/icons-material/Settings'

export const LATERAL_MENU: MenuElt[] = [
  { label: 'Teams', url: '/app/team', icon: <GroupsIcon /> },
  { label: 'Games', url: '/app/games', icon: <ScoreboardIcon /> },
  { label: 'Calendar', url: '/app/calendar', icon: <CalendarMonthIcon /> },
  { label: 'Settings', url: '/app/settings', icon: <SettingsIcon /> },
  { label: 'My Profile', url: '/app/my-profile', icon: <PersonIcon /> },
] as const
