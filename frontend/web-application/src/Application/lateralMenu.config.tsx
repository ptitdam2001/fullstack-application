import { type ReactNode } from 'react'
import { CalendarDays, Users, Volleyball } from 'lucide-react'

type MenuElt = {
  /** react-intl message id of the entry label */
  labelId: string
  url: string
  icon: ReactNode
}

export type LateralMenu = Record<'main', MenuElt[]>

export const LATERAL_MENU: LateralMenu = {
  main: [
    { labelId: 'navigation.teams', url: '/app/team', icon: <Users /> },
    { labelId: 'navigation.games', url: '/app/games', icon: <Volleyball /> },
    { labelId: 'navigation.calendar', url: '/app/calendar', icon: <CalendarDays /> },
  ],
} as const
