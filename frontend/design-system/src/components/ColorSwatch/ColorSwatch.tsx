import { ColorSwatch as AriaColorSwatch } from 'react-aria-components'
import type { ColorSwatchProps as AriaColorSwatchProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type ColorSwatchProps = AriaColorSwatchProps

export const ColorSwatch = ({ className, ...props }: ColorSwatchProps) => (
  <AriaColorSwatch
    data-slot="color-swatch"
    className={cn('box-border size-8 rounded-md border border-black/10', className)}
    style={({ color }) => ({
      background: `linear-gradient(${color}, ${color}), repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
    })}
    {...props}
  />
)
