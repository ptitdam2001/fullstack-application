import React, { ReactNode } from 'react'
import { BaseInputProps } from '../BaseInputProps.type'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useTheme } from '@Theme/Provider/ThemeProvider'

const DEFAULT_COLOR = '#000000'

type ColorInputProps = BaseInputProps & {
  label?: string
  error?: boolean
  helperText?: ReactNode
  open?: boolean
}

export const ColorInput = ({
  value = DEFAULT_COLOR,
  label,
  error,
  helperText,
  open = false,
  onChange,
  ...props
}: ColorInputProps) => {
  const currentTheme = useTheme()

  const [openPopover, setOpenPopover] = React.useState(open)
  const [color, setColor] = React.useState<string>(value ?? DEFAULT_COLOR)

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
    setOpenPopover(false)
  }

  return (
    <div className="ColorInput flex gap-2 content-center py-2">
      {label && (
        <label htmlFor={props.name} className="align-middle">
          {label}
        </label>
      )}
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'border-rounded rounded-lg w-9 h-9 pointer-events-auto dark:border-white border-1 border-black'
            )}
            style={{ background: color }}
          />
        </PopoverTrigger>
        <PopoverContent
          className={cn('p-2 w-52 h-52', { dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}
          forceMount
        >
          <HexColorPicker color={value} onChange={handleChange} {...props} />
        </PopoverContent>
      </Popover>

      {error && <p>{helperText}</p>}
    </div>
  )
}
