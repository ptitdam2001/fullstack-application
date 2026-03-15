import React, { ReactNode } from 'react'
import { BaseInputProps } from '../BaseInputProps.type'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
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
  testId,
  ...props
}: ColorInputProps) => {
  const currentTheme = useTheme()

  const [openPopover, setOpenPopover] = React.useState(open)
  const [color, setColor] = React.useState<string>(value ?? DEFAULT_COLOR)
  const testIds = useTestId(testId, ['label', 'trigger', 'error'])

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
    setOpenPopover(false)
  }

  return (
    <div className="ColorInput flex gap-2 content-center py-2">
      {label && (
        <label htmlFor={props.name} className="align-middle" data-testid={testIds.label}>
          {label}
        </label>
      )}
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'border-rounded rounded-lg w-9 h-9 pointer-events-auto dark:border-white border border-black'
            )}
            style={{ background: color }}
            data-testid={testIds.trigger}
          />
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-2 w-52 h-52', { dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}
          forceMount
        >
          <HexColorPicker color={value} onChange={handleChange} {...props} />
        </PopoverContent>
      </Popover>

      {error && <p data-testid={testIds.error}>{helperText}</p>}
    </div>
  )
}
