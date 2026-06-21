import React, { type ReactNode } from 'react'
import { type BaseInputProps } from '../BaseInputProps.type'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/design-system'
import { cn } from '@repo/design-system'
import { useTheme } from '@Theme/Provider/ThemeProvider'
import { useTestId } from '@Common/hooks/useTestId'

const DEFAULT_COLOR = '#000000'

type ColorInputProps = BaseInputProps & {
  label?: string
  error?: boolean
  helperText?: ReactNode
  open?: boolean
  testId?: string
}

export const ColorInput = ({
  value = DEFAULT_COLOR,
  label,
  error,
  helperText,
  open = false,
  onChange,
  onBlur,
  testId,
  name,
  ref: _ref,
  ...props
}: ColorInputProps) => {
  const currentTheme = useTheme()

  const [openPopover, setOpenPopover] = React.useState(open)
  const [color, setColor] = React.useState<string>(value ?? DEFAULT_COLOR)
  const testIds = useTestId(testId, ['label', 'trigger', 'error'])

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpenPopover(isOpen)
    if (!isOpen) {
      onBlur?.()
    }
  }

  return (
    <div className="ColorInput flex content-center gap-2 py-2">
      {label && (
        <label htmlFor={name} className="align-middle" data-testid={testIds.label}>
          {label}
        </label>
      )}
      <Popover open={openPopover} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          {triggerProps => (
            <button
              {...triggerProps}
              className={cn(
                'border-rounded pointer-events-auto h-9 w-9 rounded-lg border border-black dark:border-white'
              )}
              style={{ background: color }}
              data-testid={testIds.trigger}
            />
          )}
        </PopoverTrigger>
        <PopoverContent
          className={cn('h-52 w-52 p-2', { dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}
        >
          <HexColorPicker color={value} onChange={handleChange} {...props} />
        </PopoverContent>
      </Popover>

      {error && <p data-testid={testIds.error}>{helperText}</p>}
    </div>
  )
}
