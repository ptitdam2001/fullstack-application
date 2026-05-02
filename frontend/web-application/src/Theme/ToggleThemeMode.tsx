import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@repo/design-system'
import { type Theme, useSetTheme, useTheme } from './Provider/ThemeProvider'
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
      <Button variant="ghost" size="icon" aria-label="Toggle Theme">
        <ContrastIcon />
      </Button>
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
