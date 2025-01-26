import { MenuElt } from '@Layouts/components/LateralConnectedMenu'

import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export const LATERAL_MENU: MenuElt[] = [
  { label: 'My Profile', url: '/app/my-profile', icon: <PersonIcon /> },
  { label: 'Teams', url: '/app/team', icon: <GroupsIcon /> },
  { label: 'Games', url: '/app/games', icon: <ScoreboardIcon /> },
  { label: 'Calendar', url: '/app/calendar', icon: <CalendarMonthIcon /> },
] as const
