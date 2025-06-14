import { ReactNode } from 'react'
import { CalendarDays, CircleUserRound, Settings, Users, Volleyball } from 'lucide-react'

type MenuElt = {
  label: string
  url: string
  icon: ReactNode
}

export type LateralMenu = Record<'main' | 'footer', MenuElt[]>

export const LATERAL_MENU: LateralMenu = {
  main: [
    { label: 'Teams', url: '/app/team', icon: <Users /> },
    { label: 'Games', url: '/app/games', icon: <Volleyball /> },
    { label: 'Calendar', url: '/app/calendar', icon: <CalendarDays /> },
  ],
  footer: [
    { label: 'Settings', url: '/app/settings', icon: <Settings /> },
    { label: 'My Profile', url: '/app/my-profile', icon: <CircleUserRound /> },
  ],
} as const
