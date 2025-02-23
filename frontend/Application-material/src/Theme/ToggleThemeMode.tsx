import { useColorScheme } from '@mui/material/styles'
import { Mode } from '@mui/system/cssVars/useCurrentColorScheme'
import { Button, ButtonGroup, Fade, IconButton, Paper, Popper, Typography } from '@mui/material'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import LightModeIcon from '@mui/icons-material/LightMode'
import ModeNightIcon from '@mui/icons-material/ModeNight'
import { MouseEvent, useState } from 'react'

const AVAILABLE_THEMES = [
  {
    value: 'system',
    label: 'System',
    icon: <BrightnessAutoIcon />,
  },
  {
    value: 'light',
    label: 'Light',
    icon: <LightModeIcon />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <ModeNightIcon />,
  },
]

export const ToggleThemeMode = () => {
  const { mode, setMode } = useColorScheme()
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  // const handleChange = (evt: SelectChangeEvent) => setMode(evt.target.value as Mode)
  const handleThemeClick = (mode: string) => setMode(mode as Mode)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(previousOpen => !previousOpen)
  }

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? 'transition-popper' : undefined

  if (!mode) {
    return null
  }

  return (
    <>
      <IconButton aria-describedby={id} type="button" onClick={handleClick}>
        <SettingsBrightnessIcon />
      </IconButton>
      <Popper
        data-testid="ToggleThemeMode-popover"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ p: 1, bgcolor: 'background.paper' }}>
              <Typography className="py-2">Select your theme</Typography>
              <ButtonGroup variant="outlined" aria-label="Themes">
                {AVAILABLE_THEMES.map(theme => (
                  <Button
                    key={theme.value}
                    disabled={mode === theme.value}
                    onClick={() => handleThemeClick(theme.value)}
                  >
                    {theme.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}
