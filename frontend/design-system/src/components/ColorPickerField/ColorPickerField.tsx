import * as React from 'react'
import { ColorPicker as AriaColorPicker } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { Label } from '../Label/Label'
import { Button } from '../Button/Button'
import { Popover } from '../Popover/Popover'
import { PopoverContent } from '../Popover/PopoverContent'
import { ColorSwatch } from '../ColorSwatch/ColorSwatch'
import { ColorArea } from '../ColorArea/ColorArea'
import { ColorSlider } from '../ColorSlider/ColorSlider'
import { ColorField } from '../ColorField/ColorField'

const DEFAULT_COLOR = '#000000'

type ColorPickerFieldProps = {
  label?: React.ReactNode
  errorMessage?: string
  value?: string | null
  name?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  isDisabled?: boolean
  className?: string
}

export const ColorPickerField = ({
  label,
  errorMessage,
  value,
  name,
  onChange,
  onBlur,
  disabled,
  isDisabled,
  className,
}: ColorPickerFieldProps) => {
  const [open, setOpen] = React.useState(false)
  const resolvedDisabled = isDisabled ?? disabled

  return (
    <div data-slot="color-picker-field" className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label>{label}</Label>}
      <AriaColorPicker value={value ?? DEFAULT_COLOR} onChange={color => onChange?.(color.toString('hex'))}>
        <Popover
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
            if (!isOpen) {
              onBlur?.()
            }
          }}
        >
          <Button
            variant="ghost"
            isDisabled={resolvedDisabled}
            aria-label={typeof label === 'string' ? label : undefined}
            name={name}
            className="h-9 w-9 rounded-lg border border-black/10 p-0 dark:border-white/10"
          >
            <ColorSwatch className="size-full rounded-lg border-0" />
          </Button>
          <PopoverContent className="flex w-auto flex-col gap-3 p-3">
            <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
            <ColorSlider colorSpace="hsb" channel="hue" />
            <ColorField label="Hex" />
          </PopoverContent>
        </Popover>
      </AriaColorPicker>
      {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
    </div>
  )
}

ColorPickerField.displayName = 'ColorPickerField'
