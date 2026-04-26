import * as React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '../Button/Button'
import { useThemeConfig } from '../../hooks/use-theme-config'
import { cn } from '../../utils/cn'

const MODES = ['light', 'dark', 'system'] as const
type Mode = (typeof MODES)[number]

const ICONS: Record<Mode, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
}

type ThemeToggleProps = {
  className?: string
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { colorMode, setColorMode } = useThemeConfig()

  const currentMode = (colorMode ?? 'system') as Mode
  const nextMode = MODES[(MODES.indexOf(currentMode) + 1) % MODES.length]

  return (
    <Button
      data-slot="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={() => setColorMode(nextMode)}
      aria-label={`Current theme: ${currentMode}. Switch to ${nextMode}`}
      className={cn(className)}
    >
      {ICONS[currentMode]}
    </Button>
  )
}
