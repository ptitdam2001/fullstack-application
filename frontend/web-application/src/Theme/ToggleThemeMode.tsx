import { Button } from '@/components/ui/button'
import { Theme, useSetTheme, useTheme } from './Provider/ThemeProvider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ContrastIcon, MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'

type ThemeListItem = {
  value: Theme
  label: string
  icon: React.ReactNode
}

const AVAILABLE_THEMES: ThemeListItem[] = [
  {
    value: 'system',
    label: 'System',
    icon: <SunMoonIcon />,
  },
  {
    value: 'light',
    label: 'Light',
    icon: <SunIcon />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <MoonIcon />,
  },
]

export const ToggleThemeMode = () => {
  const changeTheme = useSetTheme()
  const currentTheme = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle Theme">
          <ContrastIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <p className="px-4 py-2">Select your theme</p>
        {AVAILABLE_THEMES.map(theme => (
          <DropdownMenuItem
            onClick={() => changeTheme(theme.value)}
            key={theme.value}
            disabled={currentTheme === theme.value}
          >
            {theme.icon}
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
